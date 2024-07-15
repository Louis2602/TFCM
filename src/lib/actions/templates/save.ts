'use server';

import { db } from '@/db/database';
import { template as templateTable } from '@/db/schema';
import { getCurrentUser } from '@/lib/lucia';
import { createId } from '@paralleldrive/cuid2';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function save(body: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: `\
Giving the content:
${body}
-----------------
Write a short, concise title that represents the content of the article. Return only the final title.
`,
    });

    await db.insert(templateTable).values({
      id: createId(),
      userId: user.id,
      title: text,
      body,
    });

    return {
      success: true,
      message: `Save template successfully`,
    };
  } catch (error) {
    return { success: false, message: `Something went wrong: ${error}` };
  }
}
