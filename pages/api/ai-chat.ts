import type { NextApiRequest, NextApiResponse } from "next";
import { onestaAiKnowledge } from "@/lib/onestaAiKnowledge";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ApiResponse = {
  answer?: string;
  error?: string;
};

const requestLog = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_MESSAGES = 10;

function getClientKey(req: NextApiRequest) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return req.socket.remoteAddress || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (requestLog.get(key) || []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(key, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(key, recent);
  return false;
}

function normalizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((message): message is ChatMessage => {
      if (!message || typeof message !== "object") {
        return false;
      }

      const candidate = message as Partial<ChatMessage>;
      return (
        (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.trim().length > 0
      );
    })
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY_MISSING" });
  }

  const clientKey = getClientKey(req);
  if (isRateLimited(clientKey)) {
    return res.status(429).json({ error: "RATE_LIMITED" });
  }

  const messages = normalizeMessages(req.body?.messages);
  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  if (!lastUserMessage) {
    return res.status(400).json({ error: "EMPTY_MESSAGE" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.35,
        max_tokens: 420,
        messages: [
          {
            role: "system",
            content: onestaAiKnowledge,
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("AI chat request failed", response.status, details);
      return res.status(502).json({ error: "AI_PROVIDER_ERROR" });
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content;

    if (typeof answer !== "string" || !answer.trim()) {
      return res.status(502).json({ error: "EMPTY_AI_RESPONSE" });
    }

    return res.status(200).json({ answer: answer.trim() });
  } catch (error) {
    console.error("AI chat error", error);
    return res.status(500).json({ error: "AI_CHAT_FAILED" });
  }
}
