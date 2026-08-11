"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasReceivedToken, setHasReceivedToken] = useState(false);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isAtBottomRef = useRef(true);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container || !isAtBottomRef.current) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  function handleScroll() {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    const isAtBottom = distanceFromBottom < 80;

    isAtBottomRef.current = isAtBottom;
    setShowJumpToLatest(!isAtBottom);
  }

  function jumpToLatest() {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });

    isAtBottomRef.current = true;
    setShowJumpToLatest(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedInput,
    };

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };

    const updatedMessages = [...messages, userMessage];

    setMessages([...updatedMessages, assistantMessage]);
    setInput("");
    setIsLoading(true);
    setHasReceivedToken(false);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to the AI.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });

        if (chunk) {
          setHasReceivedToken(true);

          setMessages((currentMessages) =>
            currentMessages.map((message) =>
              message.id === assistantMessage.id
                ? {
                    ...message,
                    content: message.content + chunk,
                  }
                : message
            )
          );
        }
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessage.id
            ? {
                ...message,
                content:
                  "Sorry, something went wrong. Please try again.",
              }
            : message
        )
      );
    } finally {
      setIsLoading(false);
      setHasReceivedToken(false);
      abortControllerRef.current = null;
    }
  }

  function handleStop() {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    setHasReceivedToken(false);
  }

  return (
    <section
      aria-labelledby="chat-title"
      className="mx-auto mt-12 w-full max-w-3xl px-4 pb-12"
    >
      <div className="mb-6">
        <h2
          id="chat-title"
          className="text-2xl font-bold"
        >
          AI Career Assistant
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Ask questions about my projects, skills, and frontend experience.
        </p>
      </div>

      <div className="relative">
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="h-[450px] space-y-4 overflow-y-auto rounded-xl border border-gray-700 bg-gray-950 p-4"
          aria-live="polite"
          aria-label="Conversation"
        >
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-center text-gray-500">
              <p>
                Start a conversation by asking me something.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-xl p-4 ${
                message.role === "user"
                  ? "ml-8 bg-blue-900/40"
                  : "mr-8 bg-gray-800"
              }`}
            >
              <p className="mb-1 text-sm font-semibold">
                {message.role === "user" ? "You" : "AI"}
              </p>

              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-200">
                {message.content}
              </p>
            </div>
          ))}

          {isLoading && !hasReceivedToken && (
            <div
              className="mr-8 rounded-xl bg-gray-800 p-4"
              aria-live="polite"
            >
              <p className="text-sm font-semibold">AI</p>

              <p className="mt-1 text-sm text-gray-400">
                AI is thinking...
              </p>
            </div>
          )}
        </div>

        {showJumpToLatest && (
          <button
            type="button"
            onClick={jumpToLatest}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-lg hover:bg-gray-200"
          >
            Jump to latest
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <label
          htmlFor="chat-input"
          className="sr-only"
        >
          Ask about my projects and skills
        </label>

        <input
          id="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={isLoading}
          placeholder="Ask about my projects..."
          className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-white"
        />

        {isLoading ? (
          <button
            type="button"
            onClick={handleStop}
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-500"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-lg bg-white px-6 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        )}
      </form>
    </section>
  );
}