import { pgTable, index, unique, pgEnum, varchar, integer, timestamp, text, foreignKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const service = pgEnum("service", ['grammar', 'content', 'paraphrase', 'seo', 'summarize'])
export const state = pgEnum("state", ['private', 'public'])


export const user = pgTable("user", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	credits: integer("credits").default(30).notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	name: varchar("name", { length: 255 }),
	password: text("password").notNull(),
	picture: text("picture"),
},
(table) => {
	return {
		email_idx: index("email_idx").on(table.email),
		user_email_unique: unique("user_email_unique").on(table.email),
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
},
(table) => {
	return {
		user_id_idx: index("content_user_id_idx").on(table.user_id),
	}
});

export const session = pgTable("session", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	user_id: text("user_id").notNull().references(() => user.id),
	expires_at: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
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