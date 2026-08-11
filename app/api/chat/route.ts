import { GoogleGenAI } from "@google/genai";
import { AI_MODEL, SYSTEM_PROMPT } from "@/lib/ai/config";

const ai = new GoogleGenAI({
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

    const conversation = messages
      .map((message: { role: string; content: string }) => {
        return `${message.role}: ${message.content}`;
      })
      .join("\n");

    const response = await ai.models.generateContentStream({
      model: AI_MODEL,
      contents: `${SYSTEM_PROMPT}\n\nConversation:\n${conversation}`,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.text ?? "";

            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return Response.json(
      { error: "Unable to generate a response." },
      { status: 500 }
    );
  }
}