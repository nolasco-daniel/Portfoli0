"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type ChatRole = "user" | "model";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

const initialMessages: Record<"es" | "en", ChatMessage> = {
  es: {
    id: "welcome-es",
    role: "model",
    text: "Hi, ako yung AI assistant ni Daniel. Ask me about his projects, skills, or contact details.",
  },
  en: {
    id: "welcome-en",
    role: "model",
    text: "Hi, I am Daniel's AI assistant. Ask me about his projects, skills, or contact details.",
  },
};

export default function AiChat() {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    initialMessages[lang],
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => !message.id.startsWith("welcome-"))
            .map(({ role, text }) => ({ role, text })),
        }),
      });
      const data = (await response.json()) as { text?: string; error?: string };

      if (!response.ok || !data.text) {
        throw new Error(data.error ?? t("chat.error"));
      }

      const answer = data.text;

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "model",
          text: answer,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("chat.error"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-24 right-4 z-[70] pointer-events-auto md:bottom-6 md:right-6">
      {isOpen ? (
        <section className="mb-3 flex h-[min(34rem,calc(100vh-8rem))] w-[min(calc(100vw-2rem),24rem)] flex-col overflow-hidden rounded-2xl border border-ice-300/25 bg-ink-1/90 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.75)] backdrop-blur-xl scrollbar-width-thin">
          <header className="flex items-center justify-between border-b border-ice-300/15 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-ice-50">
                {t("chat.title")}
              </p>
              <p className="text-xs text-ice-400">{t("chat.subtitle")}</p>
            </div>
            <button
              type="button"
              className="frost-icon !h-9 !w-9"
              onClick={() => setIsOpen(false)}
              aria-label={t("chat.close")}
              title={t("chat.close")}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scrollbar-thin pr-2"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <p
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-ice-100 text-ink-0"
                      : "border border-ice-300/15 bg-ink-2/70 text-ice-100"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
            {isLoading ? (
              <p className="inline-flex rounded-2xl border border-ice-300/15 bg-ink-2/70 px-3.5 py-2.5 text-sm text-ice-300">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-ice-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-ice-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-ice-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
              </p>
            ) : null}
          </div>

          {error ? (
            <p className="border-t border-ice-300/15 px-4 py-2 text-xs text-red-200">
              {error}
            </p>
          ) : null}

          <form
            className="flex gap-2 border-t border-ice-300/15 p-3"
            onSubmit={submitMessage}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-ice-300/20 bg-ink-0/70 px-3 py-2 text-sm text-ice-50 outline-none transition focus:border-ice-200/70"
              placeholder={t("chat.placeholder")}
              aria-label={t("chat.placeholder")}
            />
            <button
              type="submit"
              className="frost-btn frost-btn--primary !px-3"
              disabled={isLoading || !input.trim()}
              aria-label={t("chat.send")}
              title={t("chat.send")}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>
        </section>
      ) : null}

      {!isOpen && (
        <button
          type="button"
          className="frost-btn frost-btn--primary ml-auto flex"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-label={t("chat.open")}
          data-cursor="hover"
        >
          <svg
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
          <span>{t("chat.open")}</span>
        </button>
      )}
    </div>
  );
}
