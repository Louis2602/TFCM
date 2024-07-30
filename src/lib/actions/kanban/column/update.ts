'use server';

import { and, eq, gt, gte, lt, lte, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/lucia';
import { db } from '@/db/database';
import { kanbanColumn } from '@/db/schema';
import { KanbanColumn } from '@/types/db';

export const updateColumn = async (
	column: KanbanColumn,
	prevIndex?: number
) => {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { error: 'Not Authorized', success: false };
		}

		const existingColumn = await db.query.kanbanColumn.findFirst({
			where: (col, { and, eq }) =>
				and(eq(col.name, column.name), eq(col.boardId, column.boardId)),
		});

		if (existingColumn && prevIndex === undefined) {
			return { error: 'Column already exists', success: false };
		}

		if (prevIndex !== undefined) {			
			if (prevIndex < column.index) {
				await db
					.update(kanbanColumn)
					.set({ index: sql`${kanbanColumn.index} - 1` })
					.where(
						and(
							eq(kanbanColumn.boardId, column.boardId),
							gt(kanbanColumn.index, prevIndex),
							lte(kanbanColumn.index, column.index)
						)
					);
			} else if (prevIndex > column.index) {
				await db
					.update(kanbanColumn)
					.set({ index: sql`${kanbanColumn.index} + 1` })
					.where(
						and(
							eq(kanbanColumn.boardId, column.boardId),
							gte(kanbanColumn.index, column.index),
							lt(kanbanColumn.index, prevIndex)
						)
					);
			}
		}

		await db
			.update(kanbanColumn)
			.set(column)
			.where(eq(kanbanColumn.id, column.id));

		return { success: true };
	} catch (error: any) {
		return {
			error: `Something went wrong: ${error.message}`,
			success: false,
		};
	}
};
