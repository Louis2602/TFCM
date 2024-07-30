'use server';

import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/lucia';
import { db } from '@/db/database';

export const getBoards = async () => {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { error: 'Not Authorized', success: false };
		}

		const boardDB = await db.query.kanban.findMany({
			columns: {
				id: true,
				name: true,
			},
			where: (board, { eq }) => eq(board.userId, user.id),
		});

		return { success: true, boards: boardDB };
	} catch (error: any) {
		return {
			error: `Something went wrong: ${error.message}`,
			success: false,
		};
	}
};
