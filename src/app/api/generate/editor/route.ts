import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { match } from "ts-pattern";
import {
  CONTINUE_PROMPT,
  FIX_GRAMMAR_PROMPT,
  IMRPOVE_PROMPT,
  LONGER_PROMPT,
  SHORTER_PROMPT,
  ZAP_PROMPT,
} from "./prompt";

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  /*
	Args:
		prompt: the selected junk of text
		option: option user chose
		command: the prompt user type in
	*/
  let { prompt, option, command } = await req.json();
  const messages = match(option)
    .with("continue", () => [
      {
        role: "system",
        content: CONTINUE_PROMPT,
      },
      {
        role: "user",
        content: prompt,
      },
    ])
    .with("improve", () => [
      {
        role: "system",
        content: IMRPOVE_PROMPT,
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("shorter", () => [
      {
        role: "system",
        content: SHORTER_PROMPT,
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("longer", () => [
      {
        role: "system",
        content: LONGER_PROMPT,
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("fix", () => [
      {
        role: "system",
        content: FIX_GRAMMAR_PROMPT,
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("zap", () => [
      {
        role: "system",
        content: ZAP_PROMPT,
      },
      {
        role: "user",
        content: `For this text: ${prompt}. You have to respect the command: ${command}`,
      },
    ])
    .run() as CoreMessage[];

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });

  // Respond with the stream
  return result.toAIStreamResponse();
}
