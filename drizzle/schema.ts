import { pgTable, index, unique, pgEnum, varchar, integer, timestamp, text, foreignKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const service = pgEnum("service", ['grammar', 'content', 'paraphrase', 'seo', 'summarize'])
export const state = pgEnum("state", ['private', 'public'])
export const status = pgEnum("status", ['pending', 'accepted', 'declinced', 'declined'])
export const user_role = pgEnum("user_role", ['admin', 'user'])


export const user = pgTable("user", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	credits: integer("credits").default(30).notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	name: varchar("name", { length: 255 }),
	password: text("password").notNull(),
	picture: text("picture"),
	role: user_role("role").default('user').notNull(),
},
(table) => {
	return {
		email_idx: index("email_idx").on(table.email),
		user_email_unique: unique("user_email_unique").on(table.email),
	}
});

export const folder = pgTable("folder", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
	name: varchar("name", { length: 191 }).notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		user_id_idx: index("folder_user_id_idx").on(table.user_id),
	}
});

export const category = pgTable("category", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
	name: varchar("name", { length: 191 }).notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		user_id_idx: index("category_user_id_idx").on(table.user_id),
	}
});

export const task_board = pgTable("task_board", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
	name: text("name").notNull(),
});

export const kanban_column = pgTable("kanban_column", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	board_id: text("board_id").notNull().references(() => task_board.id, { onDelete: "cascade" } ),
	index: integer("index").notNull(),
	name: text("name").notNull(),
});

export const kanban_task = pgTable("kanban_task", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	column_id: text("column_id").notNull().references(() => kanban_column.id, { onDelete: "cascade" } ),
	board_id: text("board_id").notNull().references(() => task_board.id, { onDelete: "cascade" } ),
	assignee: text("assignee").references(() => user.id),
	index: integer("index").notNull(),
	name: text("name").notNull(),
	description: text("description"),
});

export const seo_wizard = pgTable("seo-wizard", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
	title: text("title").notNull(),
	used: integer("used").default(0).notNull(),
	category: text("category").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		trending_user_id_idx: index("trending_user_id_idx").on(table.user_id),
	}
});

export const file = pgTable("file", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
	name: text("name").notNull(),
	description: text("description"),
	url: text("url").notNull(),
	folder_id: varchar("folder_id", { length: 191 }).references(() => folder.id),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	type: text("type").notNull(),
},
(table) => {
	return {
		user_id_idx: index("file_user_id_idx").on(table.user_id),
	}
});

export const content = pgTable("content", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
	body: text("body").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	title: text("title").notNull(),
	state: state("state").default('private').notNull(),
	outline: text("outline"),
	seo_keyword: text("seo_keyword"),
	category_id: varchar("category_id", { length: 191 }).references(() => category.id),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	status: status("status").default('pending').notNull(),
	review_comment: text("review_comment"),
	reviewed_at: timestamp("reviewed_at", { mode: 'string' }),
	reviewed_by: text("reviewed_by").references(() => user.id),
},
(table) => {
	return {
		user_id_idx: index("content_user_id_idx").on(table.user_id),
		reviewed_by_idx: index("content_reviewed_by_idx").on(table.reviewed_by),
	}
});

export const prompt = pgTable("prompt", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
	service: service("service"),
	price: integer("price").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		user_id_idx: index("prompt_user_id_idx").on(table.user_id),
	}
});

export const session = pgTable("session", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
	expires_at: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
});

export const template = pgTable("template", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
	title: text("title").notNull(),
	body: text("body").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		user_id_idx: index("template_user_id_idx").on(table.user_id),
	}
});