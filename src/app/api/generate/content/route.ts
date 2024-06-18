import { createId } from "@paralleldrive/cuid2";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/db/database";
import { prompt, user } from "@/db/schema";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new Response("Unathorized", { status: 403 });
    }

    let { prompt: content, price } = await req.json();

    content = content.replace(/\/$/, "").slice(-5000) as string;

    if (currentUser.credits < price) {
      return new Response("Not enough credits to perform this action.", {
        status: 403,
      });
    }
    const messages = [
      {
        role: "system",
        content: `\
					You are a profresstion content writer that responsible for writing articles based on provided SEO keywords, article titles, article outlines, and writing tone.
					Your responses must be in Markdown format.
					Here is an example for the content format:

					=====================================

					# Title of Your Document

					## Introduction

					Write your introduction here. This section should provide an overview of the topic and set the stage for what the reader can expect in the rest of the document. You might include background information, the purpose of the document, and a brief summary of the main points.

					## Outline 1

    				- Brief description of what this section will cover.
    				- Key points or subtopics to be discussed.

					## Outline 2

    				- Brief description of what this section will cover.
    				- Key points or subtopics to be discussed.

					## Outline 3

    				- Brief description of what this section will cover.
    				- Key points or subtopics to be discussed.

					## Conclusion

					(Optional) A brief conclusion summarizing the main points covered in the document and any final thoughts or calls to action.

					=====================================

					Limit your response to no more than 190 words, but make sure to construct complete sentences.
					`,
      },
      {
        role: "user",
        content,
      },
    ] as CoreMessage[];

    await db.transaction(async (tx) => {
      await tx
        .update(user)
        .set({
          credits: sql`${user.credits} - ${price}`,
          updatedAt: new Date(),
        })
        .where(eq(user.id, currentUser.id));
      await tx.insert(prompt).values({
        id: createId(),
        userId: currentUser.id,
        price,
        service: "content",
      });
    });

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
  } catch (error) {
    return new Response(`Something went wrong: ${error}`, { status: 500 });
  }
}
