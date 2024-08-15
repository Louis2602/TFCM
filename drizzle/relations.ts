import { relations } from "drizzle-orm/relations";
import { user, category, task_board, kanban_column, kanban_task, seo-wizard, content, prompt, session, template } from "./schema";

export const categoryRelations = relations(category, ({one}) => ({
	user: one(user, {
		fields: [category.user_id],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	categories: many(category),
	task_boards: many(task_board),
	kanban_tasks: many(kanban_task),
	seo-wizards: many(seo-wizard),
	contents_user_id: many(content, {
		relationName: "content_user_id_user_id"
	}),
	contents_reviewed_by: many(content, {
		relationName: "content_reviewed_by_user_id"
	}),
	prompts: many(prompt),
	sessions: many(session),
	templates: many(template),
}));

export const task_boardRelations = relations(task_board, ({one, many}) => ({
	user: one(user, {
		fields: [task_board.user_id],
		references: [user.id]
	}),
	kanban_columns: many(kanban_column),
	kanban_tasks: many(kanban_task),
}));

export const kanban_columnRelations = relations(kanban_column, ({one, many}) => ({
	task_board: one(task_board, {
		fields: [kanban_column.board_id],
		references: [task_board.id]
	}),
	kanban_tasks: many(kanban_task),
}));

export const kanban_taskRelations = relations(kanban_task, ({one}) => ({
	kanban_column: one(kanban_column, {
		fields: [kanban_task.column_id],
		references: [kanban_column.id]
	}),
	task_board: one(task_board, {
		fields: [kanban_task.board_id],
		references: [task_board.id]
	}),
	user: one(user, {
		fields: [kanban_task.assignee],
		references: [user.id]
	}),
}));

export const seo-wizardRelations = relations(seo-wizard, ({one}) => ({
	user: one(user, {
		fields: [seo-wizard.user_id],
		references: [user.id]
	}),
}));

export const contentRelations = relations(content, ({one}) => ({
	user_user_id: one(user, {
		fields: [content.user_id],
		references: [user.id],
		relationName: "content_user_id_user_id"
	}),
	user_reviewed_by: one(user, {
		fields: [content.reviewed_by],
		references: [user.id],
		relationName: "content_reviewed_by_user_id"
	}),
}));

export const promptRelations = relations(prompt, ({one}) => ({
	user: one(user, {
		fields: [prompt.user_id],
		references: [user.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.user_id],
		references: [user.id]
	}),
}));

export const templateRelations = relations(template, ({one}) => ({
	user: one(user, {
		fields: [template.user_id],
		references: [user.id]
	}),
}));