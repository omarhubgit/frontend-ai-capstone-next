import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";
import { getProjectDetails } from "@/lib/tools/project-tools";
import { AI_MODEL, SYSTEM_PROMPT } from "@/lib/ai/config";

const MAX_MESSAGES = 20;
const MAX_INPUT_CHARS = 8000;

export const maxDuration = 30;

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const messages = body.messages;

    if (!Array.isArray(messages)) {
      return Response.json(
        { error: "Invalid messages format." },
        { status: 400 }
      );
    }

    if (messages.length > MAX_MESSAGES) {
      return Response.json(
        {
          error: `Too many messages. Please start a new conversation after ${MAX_MESSAGES} messages.`,
        },
        { status: 413 }
      );
    }

    const totalInputChars = messages.reduce((total: number, message) => {
      if (!Array.isArray(message?.parts)) {
        return total;
      }

      const messageText = message.parts
        .filter((part: { type?: string }) => part?.type === "text")
        .reduce(
          (textTotal: number, part: { text?: string }) =>
            textTotal + (typeof part.text === "string" ? part.text.length : 0),
          0
        );

      return total + messageText;
    }, 0);

    if (totalInputChars > MAX_INPUT_CHARS) {
      return Response.json(
        {
          error: `Your conversation is too long. Please keep the total text under ${MAX_INPUT_CHARS} characters.`,
        },
        { status: 413 }
      );
    }

    const result = streamText({
      model: googleProvider(AI_MODEL),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools: {
        get_project_details: getProjectDetails,
      },
      stopWhen: ({ steps }) => steps.length >= 3,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    return Response.json(
      { error: "Unable to generate a response." },
      { status: 500 }
    );
  }
}