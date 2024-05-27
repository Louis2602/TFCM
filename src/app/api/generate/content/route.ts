import { createId } from '@paralleldrive/cuid2';
import { eq, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/db/database';
import { prompt, user } from '@/db/schema';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import openai from '@/lib/openai';

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return new Response('Unathorized', { status: 403 });
		}

		let { prompt: content } = await req.json();

		content = content.replace(/\/$/, '').slice(-5000) as string;

		const price = 1;

		if (currentUser.credits < price) {
			return new Response('Not enough credits to perform this action.', {
				status: 403,
			});
		}

		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content:
						'You are an AI writing assistant that writes articles based on provided SEO keywords, article titles, article outlines, and writing tone.' +
						'Format your responses in Markdown format, to actually look like an article and always finish responses with new line break.' +
						'Limit your response to no more than 190 words, but make sure to construct complete sentences.',
				},
				{
					role: 'user',
					content,
				},
			],
			temperature: 0.7,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
			n: 1,
			stream: true,
		});

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
				service: 'content',
			});
		});

		const stream = OpenAIStream(response);

		return new StreamingTextResponse(stream);
	} catch (error) {
		return new Response(`Something went wrong: ${error}`, { status: 500 });
	}
}
