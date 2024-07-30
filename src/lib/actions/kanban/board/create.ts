'use server';

import { createId } from '@paralleldrive/cuid2';
import { getCurrentUser } from '@/lib/lucia';
import { db } from '@/db/database';
import { kanban } from '@/db/schema';

export const createBoard = async (name: string) => {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { error: 'Not Authorized', success: false };
		}

		const existingBoard = await db.query.kanban.findFirst({
			where: (board, { eq }) => eq(board.name, name),
		});

		if (existingBoard) {
			return { error: 'Board already exists', success: false };
		}

		const [newBoard] = await db
			.insert(kanban)
			.values({
				id: createId(),
				userId: user.id,
				name: name,
			})
			.returning();

		return { success: true, newBoard };
	} catch (error: any) {
		return {
			error: `Something went wrong: ${error.message}`,
			success: false,
		};
	}
};
