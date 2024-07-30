'use server';

import { createId } from '@paralleldrive/cuid2';
import { getCurrentUser } from '@/lib/lucia';
import { db } from '@/db/database';
import { kanbanColumn } from '@/db/schema';

export const createColumn = async (boardId: string, name: string, index: number) => {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { error: 'Not Authorized', success: false };
		}

		const existingColumn = await db.query.kanbanColumn.findFirst({
			where: (col, { and, eq }) => and(eq(col.name, name), eq(col.boardId, boardId)),
		});

		if (existingColumn) {
			return { error: 'Column already exists', success: false };
		}

		const [newColumn] = await db
			.insert(kanbanColumn)
			.values({
				id: createId(),
				boardId: boardId,
				index: index,
				name: name,
			})
			.returning();

		return { success: true, newColumn };
	} catch (error: any) {
		return {
			error: `Something went wrong: ${error.message}`,
			success: false,
		};
	}
};
