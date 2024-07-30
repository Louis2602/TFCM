'use server';

import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/lucia';
import { db } from '@/db/database';
import { task } from '@/db/schema';

export const deleteTask = async (id: string) => {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { error: 'Not Authorized', success: false };
		}
		
		await db
			.delete(task)
			.where(eq(task.id, id))

		return { success: true };
	} catch (error: any) {
		return {
			error: `Something went wrong: ${error.message}`,
			success: false,
		};
	}
};
