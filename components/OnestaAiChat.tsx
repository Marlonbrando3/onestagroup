import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { IoChatbubblesOutline, IoClose, IoSend } from "react-icons/io5";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const hiddenPathPrefixes = [
  "/CRM",
  "/crm",
  "/admin",
  "/onesari",
  "/login",
  "/logincrm",
  "/signup",
];

const initialMessages = {
  pl: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Cześć, jestem asystentem Onesta. Mogę pomóc porównać kraje, doprecyzować potrzeby albo wskazać, gdzie szukać ofert.",
    },
  ] as Message[],
  en: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi, I am the Onesta assistant. I can help compare countries, clarify your needs or point you to the right property offers.",
    },
  ] as Message[],
};

function createMessage(role: Message["role"], content: string): Message {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
  };
}

export default function OnestaAiChat() {
  const router = useRouter();
  const isEn = router.pathname.startsWith("/en");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(
    initialMessages[isEn ? "en" : "pl"],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const shouldHide = useMemo(
    () =>
      hiddenPathPrefixes.some((prefix) => router.pathname.startsWith(prefix)),
    [router.pathname],
  );

  if (shouldHide) {
    return null;
  }

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = input.trim();
    if (!content || loading) {
      return;
    }

    const userMessage = createMessage("user", content);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.answer) {
        throw new Error(data?.error || "AI_CHAT_FAILED");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("assistant", data.answer),
      ]);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "assistant",
          isEn
            ? "I could not respond right now. Please try again shortly or contact an Onesta advisor directly."
            : "Nie udało mi się teraz odpowiedzieć. Spróbuj ponownie za chwilę albo skontaktuj się bezpośrednio z doradcą Onesty.",
        ),
      ]);
    } finally {
      setLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[80] font-sans sm:bottom-6 sm:right-6">
      {open && (
        <section className="mb-3 flex h-[560px] max-h-[calc(100vh-120px)] w-[calc(100vw-32px)] max-w-[390px] flex-col overflow-hidden border border-[#e5dac7] bg-[#fbf8f2] shadow-[0_22px_60px_rgba(24,35,52,0.24)] sm:w-[390px]">
          <header className="flex items-center justify-between border-b border-[#e8ddca] bg-white px-4 py-3">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#9b7a36]">
                Onesta AI
              </p>
              <p className="text-xs font-medium text-[#5f6b7a]">
                {isEn
                  ? "Overseas property assistant"
                  : "Asystent nieruchomości za granicą"}
              </p>
            </div>
            <button
              type="button"
              aria-label={isEn ? "Close chat" : "Zamknij czat"}
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5dac7] bg-[#fbf8f2] text-[#182334] transition hover:border-[#b8954c]"
            >
              <IoClose className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[86%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-[#182334] text-white"
                      : "border border-[#e8ddca] bg-white text-[#27364a]"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-[#e8ddca] bg-white px-4 py-3 text-sm text-[#5f6b7a]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#b8954c]" />
                  {isEn ? "Writing an answer..." : "Piszę odpowiedź..."}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="border-t border-[#e8ddca] bg-white p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                maxLength={1200}
                rows={2}
                placeholder={
                  isEn
                    ? "Ask about Spain, Cyprus, budget or the purchase process..."
                    : "Zapytaj o Hiszpanię, Cypr, budżet albo proces zakupu..."
                }
                className="min-h-[48px] flex-1 resize-none rounded-2xl border border-[#d7c8ad] bg-[#fbf8f2] px-4 py-3 text-sm text-[#182334] outline-none transition placeholder:text-[#8a94a3] focus:border-[#b8954c] focus:bg-white"
              />
              <button
                type="submit"
                disabled={loading || input.trim().length === 0}
                aria-label={isEn ? "Send message" : "Wyślij wiadomość"}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#b8954c] text-white transition hover:bg-[#9b7a36] disabled:cursor-not-allowed disabled:bg-[#d7c8ad]"
              >
                <IoSend className="h-5 w-5" />
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        aria-label={
          open
            ? isEn
              ? "Close Onesta AI chat"
              : "Zamknij czat Onesta AI"
            : isEn
              ? "Open Onesta AI chat"
              : "Otwórz czat Onesta AI"
        }
        onClick={() => setOpen((current) => !current)}
        className="flex h-14 items-center gap-3 rounded-full border border-[#d7c8ad] bg-[#182334] px-5 text-sm font-extrabold uppercase tracking-[0.1em] text-white shadow-[0_16px_36px_rgba(24,35,52,0.26)] transition hover:border-[#b8954c] hover:bg-[#243449]"
      >
        <IoChatbubblesOutline className="h-6 w-6 text-[#d8b66a]" />
        <span className="hidden sm:inline">{isEn ? "Ask AI" : "Zapytaj AI"}</span>
      </button>
    </div>
  );
}
