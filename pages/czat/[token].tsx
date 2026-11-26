import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { getPublicChat } from "@/lib/leadManager/chat";

// Czat ofertowy: link „wygeneruj oferty” z SMS-a powitalnego → 2 pytania → prezentacja dopasowana do odpowiedzi.

type ChatProps = {
  token: string;
  chat: Awaited<ReturnType<typeof getPublicChat>>;
};

type Message =
  | { id: number; from: "agent"; text: string }
  | { id: number; from: "user"; text: string }
  | { id: number; from: "result"; url: string; offersCount: number };

const TYPING_MS = 1100;
const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export default function OfferChatPage({ token, chat }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<number>(-1); // -1 = powitanie, 0..1 = pytania, 2 = koniec
  const [answers, setAnswers] = useState<string[]>([]);
  const [error, setError] = useState("");
  const idRef = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const push = (message: Omit<Message, "id"> & Record<string, unknown>) =>
    setMessages((current) => [...current, { ...(message as any), id: ++idRef.current }]);

  async function agentSays(text: string) {
    setTyping(true);
    await sleep(Math.min(TYPING_MS + text.length * 8, 2200));
    setTyping(false);
    push({ from: "agent", text });
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (token) {
      fetch("/api/leadmanager/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "open", token }),
      }).catch(() => undefined);
    }
    (async () => {
      await sleep(400);
      await agentSays(chat.greeting);
      if (!chat.enabled) {
        await agentSays("Czat jest chwilowo niedostępny – oddzwonimy do Ciebie wkrótce.");
        setStep(2);
        return;
      }
      if (chat.previousUrl) {
        await agentSays("Twoja prezentacja jest już gotowa – możesz do niej wrócić w każdej chwili:");
        push({ from: "result", url: chat.previousUrl, offersCount: 0 });
        await agentSays("Chcesz zobaczyć inne oferty? Odpowiedz jeszcze raz na pytania poniżej.");
      }
      await agentSays(chat.questions[0].text);
      setStep(0);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, step]);

  async function choose(questionIndex: number, optionId: string, label: string) {
    if (step !== questionIndex) return;
    setStep(-2); // blokada podwójnego kliknięcia
    push({ from: "user", text: label });
    const nextAnswers = [...answers.slice(0, questionIndex), optionId];
    setAnswers(nextAnswers);
    if (questionIndex + 1 < chat.questions.length) {
      await agentSays(chat.questions[questionIndex + 1].text);
      setStep(questionIndex + 1);
      return;
    }
    setTyping(true);
    try {
      const [response] = await Promise.all([
        fetch("/api/leadmanager/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "complete", token, answers: nextAnswers }),
        }),
        sleep(1600),
      ]);
      const result = await response.json();
      setTyping(false);
      if (!response.ok) throw new Error(result.error || "Coś poszło nie tak.");
      push({ from: "agent", text: chat.finalText });
      push({ from: "result", url: result.url, offersCount: result.offersCount || 0 });
      setStep(2);
    } catch (reason) {
      setTyping(false);
      setError(reason instanceof Error ? reason.message : "Coś poszło nie tak.");
      setStep(2);
    }
  }

  const question = step >= 0 && step < chat.questions.length ? chat.questions[step] : null;

  return (
    <>
      <Head>
        <title>{`Czat z ${chat.agentName} | Onesta Group`}</title>
        <meta content="noindex, nofollow" name="robots" />
        <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport" />
        <meta content="#0f5d52" name="theme-color" />
      </Head>
      <main className="chatShell">
        <header className="chatHeader">
          <img alt="" className="chatAvatar" src="/Marek.webp" />
          <div>
            <strong>{chat.agentName}</strong>
            <span>
              <i aria-hidden="true" /> {typing ? "pisze…" : chat.agentSubtitle || "online"}
            </span>
          </div>
        </header>

        <section aria-live="polite" className="chatBody">
          <p className="chatDay">Dzisiaj</p>
          {messages.map((message) =>
            message.from === "result" ? (
              <a className="chatResult" href={message.url} key={message.id}>
                <span className="chatResultIcon" aria-hidden="true">
                  🏡
                </span>
                <span>
                  <strong>Twoje oferty są gotowe</strong>
                  <small>{message.offersCount ? `${message.offersCount} ofert dopasowanych do Ciebie` : "Kliknij, aby otworzyć"}</small>
                </span>
                <em>Zobacz →</em>
              </a>
            ) : (
              <div className={`chatBubble ${message.from}`} key={message.id}>
                {message.text}
              </div>
            ),
          )}
          {typing ? (
            <div className="chatBubble agent chatTyping" aria-label="pisze">
              <span />
              <span />
              <span />
            </div>
          ) : null}
          {error ? <div className="chatBubble agent">{error}</div> : null}
          <div ref={endRef} />
        </section>

        <footer className="chatFooter">
          {question ? (
            <div className="chatOptions">
              {question.options.map((option) => (
                <button key={option.id} type="button" onClick={() => choose(step, option.id, option.label)}>
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="chatHint">{step === 2 ? "Dziękujemy! Odezwiemy się wkrótce." : "Wybierz odpowiedź, gdy pojawi się pytanie."}</p>
          )}
        </footer>
      </main>
      <style jsx global>{`
        html,
        body {
          background: #e9e4dc;
          margin: 0;
        }
        .chatShell {
          background: #efeae2;
          color: #111b21;
          display: flex;
          flex-direction: column;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          height: 100dvh;
          margin: 0 auto;
          max-width: 560px;
        }
        .chatHeader {
          align-items: center;
          background: #0f5d52;
          color: #ffffff;
          display: flex;
          gap: 12px;
          padding: max(12px, env(safe-area-inset-top)) 16px 12px;
        }
        .chatAvatar {
          border: 2px solid rgba(255, 255, 255, 0.6);
          border-radius: 999px;
          height: 44px;
          object-fit: cover;
          width: 44px;
        }
        .chatHeader div {
          display: grid;
          gap: 2px;
        }
        .chatHeader strong {
          font-size: 16px;
        }
        .chatHeader span {
          align-items: center;
          display: flex;
          font-size: 12.5px;
          gap: 6px;
          opacity: 0.9;
        }
        .chatHeader i {
          background: #5ee07a;
          border-radius: 999px;
          display: inline-block;
          height: 8px;
          width: 8px;
        }
        .chatBody {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
          padding: 14px 12px 18px;
        }
        .chatDay {
          align-self: center;
          background: #ffffffcc;
          border-radius: 8px;
          color: #54656f;
          font-size: 12px;
          margin: 0 0 6px;
          padding: 4px 10px;
        }
        .chatBubble {
          animation: chatIn 0.22s ease-out;
          border-radius: 10px;
          box-shadow: 0 1px 1px rgba(11, 20, 26, 0.12);
          font-size: 15px;
          line-height: 1.45;
          max-width: 82%;
          padding: 8px 11px;
          white-space: pre-line;
        }
        .chatBubble.agent {
          align-self: flex-start;
          background: #ffffff;
          border-top-left-radius: 2px;
        }
        .chatBubble.user {
          align-self: flex-end;
          background: #d9fdd3;
          border-top-right-radius: 2px;
        }
        .chatTyping {
          align-items: center;
          display: flex;
          gap: 4px;
          padding: 12px 14px;
        }
        .chatTyping span {
          animation: chatDot 1s infinite ease-in-out;
          background: #8696a0;
          border-radius: 999px;
          height: 7px;
          width: 7px;
        }
        .chatTyping span:nth-child(2) {
          animation-delay: 0.15s;
        }
        .chatTyping span:nth-child(3) {
          animation-delay: 0.3s;
        }
        .chatResult {
          align-items: center;
          align-self: flex-start;
          animation: chatIn 0.25s ease-out;
          background: #ffffff;
          border: 1px solid #cfe9e2;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(11, 20, 26, 0.1);
          color: #111b21;
          display: flex;
          gap: 12px;
          max-width: 88%;
          padding: 12px 14px;
          text-decoration: none;
        }
        .chatResultIcon {
          align-items: center;
          background: #e7f5f1;
          border-radius: 10px;
          display: flex;
          font-size: 22px;
          height: 44px;
          justify-content: center;
          width: 44px;
        }
        .chatResult span:not(.chatResultIcon) {
          display: grid;
          gap: 2px;
        }
        .chatResult strong {
          font-size: 15px;
        }
        .chatResult small {
          color: #54656f;
          font-size: 12.5px;
        }
        .chatResult em {
          background: #0f5d52;
          border-radius: 999px;
          color: #ffffff;
          font-size: 13px;
          font-style: normal;
          font-weight: 700;
          margin-left: auto;
          padding: 7px 12px;
          white-space: nowrap;
        }
        .chatFooter {
          background: #f0f2f5;
          border-top: 1px solid #e1e4e7;
          padding: 10px 12px max(12px, env(safe-area-inset-bottom));
        }
        .chatOptions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }
        .chatOptions button {
          animation: chatIn 0.2s ease-out;
          background: #ffffff;
          border: 1px solid #0f5d52;
          border-radius: 999px;
          color: #0f5d52;
          cursor: pointer;
          font: inherit;
          font-size: 15px;
          font-weight: 600;
          min-height: 44px;
          padding: 0 18px;
        }
        .chatOptions button:active,
        .chatOptions button:hover {
          background: #0f5d52;
          color: #ffffff;
        }
        .chatHint {
          color: #667781;
          font-size: 13px;
          margin: 6px 0;
          text-align: center;
        }
        @keyframes chatIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes chatDot {
          0%,
          80%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ChatProps> = async ({ params, res }) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  const token = typeof params?.token === "string" ? params.token.slice(0, 2048) : "";
  const chat = await getPublicChat(token);
  return { props: { token, chat } };
};
