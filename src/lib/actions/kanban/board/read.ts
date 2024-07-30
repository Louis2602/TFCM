'use server';

import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/lucia';
import { db } from '@/db/database';
import { kanban, kanbanColumn, task } from '@/db/schema';
import { Task } from '@/types/db';
import { string } from 'zod';
import { KanbanBoardData } from '@/types/kanban';

export const getBoard = async (id: string) => {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { error: 'Not Authorized', success: false };
		}

		const boardDB = await db
			.select()
			.from(kanban)
			.where(eq(kanban.id, id))
			.leftJoin(kanbanColumn, eq(kanban.id, kanbanColumn.boardId))
			.leftJoin(task, eq(kanbanColumn.id, task.columnId));

		const board = boardDB.reduce<KanbanBoardData>(
			(prev, cur) => {
				prev.name = cur.task_board.name;
				const col = cur.kanban_column;
				if (id === cur.task_board.id) {
					if (!col) {
						return prev;
					}

					let colIdx = prev.columns.findIndex((c) => c.id == col.id);

					if (colIdx === -1) {
						colIdx = prev.columns.push({ ...col, tasks: [] }) - 1;
					}

					if (cur.kanban_task) {
						prev.columns[colIdx].tasks.push(cur.kanban_task);
					}
				}
				return prev;
			},
			{
				id: id,
				name: '',
				columns: [],
			}
		);
		board.columns.sort((a, b) => a.index - b.index);
		board.columns.forEach((col) =>
			col.tasks.sort((a, b) => a.index - b.index)
		);
		return { success: true, board };
	} catch (error: any) {
		return {
			error: `Something went wrong: ${error.message}`,
			success: false,
		};
	}
};
