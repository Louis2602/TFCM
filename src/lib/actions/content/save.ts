'use server';

import { db } from '@/db/database';
import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';
import { content as contentTable } from '@/db/schema';

export async function save(body: string) {
	try {
		const user = await currentUser();

		if (!user) {
			throw new Error('Unauthorized');
		}

		await db.insert(contentTable).values({
			userId: user.id,
			body,
		});

		revalidatePath(`/content-writer`);

		return {
			success: true,
			message: `Save content successfully`,
		};
	} catch (error) {
		return { success: false, message: `Something went wrong: ${error}` };
	}
}
