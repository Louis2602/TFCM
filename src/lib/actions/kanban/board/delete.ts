'use server';

import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/lucia';
import { db } from '@/db/database';
import { task, kanban } from '@/db/schema';

export const deleteBoard = async (id: string) => {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { error: 'Not Authorized', success: false };
		}

		await db.delete(task).where(
			eq(task.boardId, id)
		)

		await db.delete(kanban).where(
            eq(kanban.id, id)
        )

		return { success: true };
	} catch (error: any) {
		return {
			error: `Something went wrong: ${error.message}`,
			success: false,
		};
	}
};
