'use server';

import { createId } from '@paralleldrive/cuid2';
import { getCurrentUser } from '@/lib/lucia';
import { db } from '@/db/database';
import { task as taskTable } from '@/db/schema';
import { Task } from '@/types/db';

export const createTask = async (task: Task) => {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { error: 'Not Authorized', success: false };
		}

		const existingTask = await db.query.task.findFirst({
			where: (t, { and, eq }) =>
				and(eq(t.name, task.name), eq(t.boardId, task.boardId)),
		});

		if (existingTask) {
			return { error: 'Task already exists', success: false };
		}

		const [newTask] = await db
			.insert(taskTable)
			.values({
				...task,
				id: createId(),
			})
			.returning();

		return { success: true, newTask };
	} catch (error: any) {
		return {
			error: `Something went wrong: ${error.message}`,
			success: false,
		};
	}
};
