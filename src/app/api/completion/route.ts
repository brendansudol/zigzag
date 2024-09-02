import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json()

  const { text } = await generateText({
    model: openai("gpt-4-turbo"),
    system: "You are a professional writer. You write simple, clear, and concise content.",
    prompt: "Tell me a short, funny joke.",
  })

  return Response.json({ prompt, text })
}
