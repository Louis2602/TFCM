import * as z from 'zod';

export const BoardSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: 'Column name must be at least 2 characters long',
		})
		.max(50, {
			message: 'Column name must be no longer than 50 characters',
		}),
});

export const ColumnSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: 'Column name must be at least 2 characters long',
		})
		.max(50, {
			message: 'Column name must be no longer than 50 characters',
		}),
});

export const TaskSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: 'Task name must be at least 2 characters long',
		})
		.max(50, {
			message: 'Task name must be no longer than 50 characters',
		}),
	description: z
		.string()
		.max(200, {
			message: 'Description must be no longer than 200 characters',
		}).nullable()
});
