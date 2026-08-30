import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Chat from "../app/components/chat/Chat";

const mockSendMessage = vi.fn();
const mockStop = vi.fn();
const mockRegenerate = vi.fn();

type MockChatState = {
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    parts: Array<{
      type: string;
      text?: string;
      state?: string;
      input?: {
        projectName: string;
      };
      output?: {
        name: string;
        description: string;
        technologies: string[];
        features: string[];
      };
    }>;
  }>;
  status: "ready" | "submitted" | "streaming" | "error";
  error: Error | undefined;
};

let mockChatState: MockChatState = {
  messages: [],
  status: "ready",
  error: undefined,
};

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: mockChatState.messages,
    sendMessage: mockSendMessage,
    status: mockChatState.status,
    stop: mockStop,
    error: mockChatState.error,
    regenerate: mockRegenerate,
  }),
}));

describe("Chat", () => {
  beforeEach(() => {
    mockChatState = {
      messages: [],
      status: "ready",
      error: undefined,
    };

    mockSendMessage.mockReset();
    mockStop.mockReset();
    mockRegenerate.mockReset();
  });

  it("shows the empty state when there are no messages", () => {
    render(<Chat />);

    expect(
      screen.getByText("Start a conversation by asking me something.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Tell me about my movie project",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "What frontend technologies do I know?",
      })
    ).toBeInTheDocument();
  });

  it("renders user and assistant text messages", () => {
    mockChatState.messages = [
      {
        id: "user-1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Tell me about my projects.",
          },
        ],
      },
      {
        id: "assistant-1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "I can tell you about your portfolio projects.",
          },
        ],
      },
    ];

    render(<Chat />);

    expect(screen.getByText("Tell me about my projects.")).toBeInTheDocument();

    expect(
      screen.getByText(
        "I can tell you about your portfolio projects."
      )
    ).toBeInTheDocument();
  });

  it("shows the thinking state while a response is submitted", () => {
    mockChatState.status = "submitted";

    render(<Chat />);

    expect(screen.getByText("AI is thinking...")).toBeInTheDocument();
  });

  it("renders the tool input state", () => {
    mockChatState.messages = [
      {
        id: "tool-input",
        role: "assistant",
        parts: [
          {
            type: "tool-get_project_details",
            state: "input-available",
            input: {
              projectName: "Movie Search & Favorites",
            },
          },
        ],
      },
    ];

    render(<Chat />);

    expect(screen.getByText("Project lookup")).toBeInTheDocument();

    expect(
      screen.getByText("Movie Search & Favorites")
    ).toBeInTheDocument();
  });

  it("renders the tool output project card", () => {
    mockChatState.messages = [
      {
        id: "tool-output",
        role: "assistant",
        parts: [
          {
            type: "tool-get_project_details",
            state: "output-available",
            output: {
              name: "Movie Search & Favorites",
              description:
                "A React application for searching movies and saving favorite movies.",
              technologies: [
                "React",
                "Vite",
                "JavaScript",
                "TMDB API",
              ],
              features: [
                "Movie search",
                "Movie results display",
                "Favorites",
                "LocalStorage persistence",
              ],
            },
          },
        ],
      },
    ];

    render(<Chat />);

    expect(screen.getByText("Project found")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Movie Search & Favorites",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "A React application for searching movies and saving favorite movies."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vite")).toBeInTheDocument();
    expect(screen.getByText("TMDB API")).toBeInTheDocument();

    expect(screen.getByText("✓ Movie search")).toBeInTheDocument();
    expect(
      screen.getByText("✓ LocalStorage persistence")
    ).toBeInTheDocument();
  });

  it("renders the tool error state", () => {
    mockChatState.messages = [
      {
        id: "tool-error",
        role: "assistant",
        parts: [
          {
            type: "tool-get_project_details",
            state: "output-error",
          },
        ],
      },
    ];

    render(<Chat />);

    expect(
      screen.getByText("Couldn't load project")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "An error occurred while looking up the project."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Try asking about another project.")
    ).toBeInTheDocument();
  });

  it("shows the chat error with a working retry button", () => {
    mockChatState.error = new Error("Test chat failure");

    render(<Chat />);

    expect(
      screen.getByRole("alert")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Something went wrong")
    ).toBeInTheDocument();

    const retryButton = screen.getByRole("button", {
      name: "Retry",
    });

    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);

    expect(mockRegenerate).toHaveBeenCalledTimes(1);
  });

  it("submits a user question", async () => {
    render(<Chat />);

    const input = screen.getByLabelText(
      "Ask about my projects and skills"
    );

    fireEvent.change(input, {
      target: {
        value: "What frontend technologies do I know?",
      },
    });

    fireEvent.submit(input.closest("form")!);

    expect(mockSendMessage).toHaveBeenCalledWith({
      text: "What frontend technologies do I know?",
    });
  });

  it("uses the example question buttons", () => {
    render(<Chat />);

    const movieButton = screen.getByRole("button", {
      name: "Tell me about my movie project",
    });

    fireEvent.click(movieButton);

    expect(mockSendMessage).toHaveBeenCalledWith({
      text: "Tell me about my Movie Search & Favorites project.",
    });
  });

  it("shows the stop button while streaming", () => {
    mockChatState.status = "streaming";

    render(<Chat />);

    const stopButton = screen.getByRole("button", {
      name: "Stop",
    });

    expect(stopButton).toBeInTheDocument();

    fireEvent.click(stopButton);

    expect(mockStop).toHaveBeenCalledTimes(1);
  });
});