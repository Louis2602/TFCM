'use server';

import { and, eq, gt, gte, lt, lte, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/lucia';
import { db } from '@/db/database';
import { task as taskTable } from '@/db/schema';
import { Task } from '@/types/db';

const updateIndex = async (task: Task, prevTask: Task) => {
	if (prevTask.columnId === task.columnId) {
		if (prevTask.index !== undefined) {
			if (prevTask.index < task.index) {
				await db
					.update(taskTable)
					.set({ index: sql`${task.index} - 1` })
					.where(
						and(
							eq(taskTable.columnId, task.columnId),
							gt(taskTable.index, prevTask.index),
							lte(taskTable.index, task.index)
						)
					);
			} else if (prevTask.index > task.index) {
				await db
					.update(taskTable)
					.set({ index: sql`${taskTable.index} + 1` })
					.where(
						and(
							eq(taskTable.columnId, task.columnId),
							gte(taskTable.index, task.index),
							lt(taskTable.index, prevTask.index)
						)
					);
			}
		}
	} else {
		await db
			.update(taskTable)
			.set({ index: sql`${taskTable.index} + 1` })
			.where(
				and(
					eq(taskTable.columnId, task.columnId),
					gte(taskTable.index, task.index)
				)
			);
		await db
			.update(taskTable)
			.set({ index: sql`${taskTable.index} - 1` })
			.where(
				and(
					eq(taskTable.columnId, prevTask.columnId),
					gte(taskTable.index, task.index)
				)
			);
	}
}

export const updateTask = async (task: Task) => {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { error: 'Not Authorized', success: false };
		}

		const prevTask = await db.query.task.findFirst({
			where: (t, { eq }) => eq(t.id, task.id),
		});

		if (!prevTask) {
			return { error: 'Task not found', success: false };
		}

		const existingTask = await db.query.task.findFirst({
			where: (t, { and, eq }) =>
				and(
					eq(t.boardId, task.boardId),
					eq(t.columnId, task.columnId),
					eq(t.name, task.name)
				),
		});

		if (existingTask && task.index === undefined) {
			return { error: 'Task already exists', success: false };
		}

		await updateIndex(task, prevTask);

		await db
			.update(taskTable)
			.set({
				...task,
			})
			.where(eq(taskTable.id, task.id));

		return { success: true };
	} catch (error: any) {
		return {
			error: `Something went wrong: ${error.message}`,
			success: false,
		};
	}
};
