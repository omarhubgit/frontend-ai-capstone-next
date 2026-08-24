"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

type Project = {
  name: string;
  description: string;
  technologies: string[];
  features: string[];
};

type ToolInput = {
  projectName: string;
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isAtBottomRef = useRef(true);

  const { messages, sendMessage, status, stop } = useChat();

  const isLoading =
    status === "submitted" || status === "streaming";

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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    setInput("");

    await sendMessage({
      text: trimmedInput,
    });
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
            <div key={message.id}>
              <div
                className={`rounded-xl p-4 ${
                  message.role === "user"
                    ? "ml-8 bg-blue-900/40"
                    : "mr-8 bg-gray-800"
                }`}
              >
                <p className="mb-1 text-sm font-semibold">
                  {message.role === "user" ? "You" : "AI"}
                </p>

                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <p
                        key={index}
                        className="whitespace-pre-wrap text-sm leading-6 text-gray-200"
                      >
                        {part.text}
                      </p>
                    );
                  }

                  if (part.type === "tool-get_project_details") {
                    if (part.state === "input-streaming") {
                      return (
                        <div
                          key={index}
                          className="mt-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3"
                        >
                          <p className="text-sm font-semibold text-yellow-300">
                            Looking up project...
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Preparing the project search.
                          </p>
                        </div>
                      );
                    }

                    if (part.state === "input-available") {
                      const toolInput =
                        part.input as ToolInput;

                      return (
                        <div
                          key={index}
                          className="mt-3 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3"
                        >
                          <p className="text-sm font-semibold text-blue-300">
                            Looking up project
                          </p>

                          <p className="mt-1 text-sm text-gray-200">
                            {toolInput.projectName}
                          </p>
                        </div>
                      );
                    }

                    if (part.state === "output-available") {
                      const project =
                        part.output as Project;

                      return (
                        <div
                          key={index}
                          className="mt-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-green-300">
                            Project found
                          </p>

                          <h3 className="mt-2 text-lg font-bold text-white">
                            {project.name}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-gray-300">
                            {project.description}
                          </p>

                          <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Technologies
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2">
                              {project.technologies.map(
                                (technology) => (
                                  <span
                                    key={technology}
                                    className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-200"
                                  >
                                    {technology}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Features
                            </p>

                            <ul className="mt-2 space-y-1 text-sm text-gray-300">
                              {project.features.map(
                                (feature) => (
                                  <li key={feature}>
                                    ✓ {feature}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      );
                    }

                    if (part.state === "output-error") {
                      return (
                        <div
                          key={index}
                          className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4"
                        >
                          <p className="text-sm font-semibold text-red-300">
                            Couldn't load project
                          </p>

                          <p className="mt-1 text-sm text-gray-300">
                            {part.errorText}
                          </p>

                          <p className="mt-3 text-xs text-gray-500">
                            Try asking about another project.
                          </p>
                        </div>
                      );
                    }
                  }

                  return null;
                })}
              </div>
            </div>
          ))}

          {status === "submitted" && (
            <div
              className="mr-8 rounded-xl bg-gray-800 p-4"
              aria-live="polite"
            >
              <p className="text-sm font-semibold">
                AI
              </p>

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
            onClick={stop}
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