import { sql } from 'drizzle-orm';
import {
	pgTable,
	varchar,
	json,
	index,
	integer,
	timestamp,
	text,
	pgEnum,
} from 'drizzle-orm/pg-core';

export const account = pgTable(
	'account',
	{
		id: varchar('id', { length: 191 }).notNull().primaryKey(),
		userId: varchar('user_id', { length: 191 }).notNull().unique(),
		attributes: json('attributes').notNull(),
	},
	(account) => ({
		userIdx: index('user_idx').on(account.userId),
	})
);

export const user = pgTable(
	'user',
	{
		id: varchar('id', { length: 191 }).notNull().primaryKey(),
		accountId: varchar('account_id', { length: 191 }).notNull().unique(),
		email: varchar('email', { length: 191 }).notNull().unique(),
		imageUrl: text('image_url'),
		credits: integer('credits').default(30).notNull(),
		firstName: varchar('first_name', { length: 191 }),
		lastName: varchar('last_name', { length: 191 }),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.defaultNow()
			.$onUpdate(() => sql`CURRENT_TIMESTAMP`),
	},
	(user) => ({
		emailIdx: index('email_idx').on(user.email),
	})
);

export const serviceEnum = pgEnum('service', [
	'grammar',
	'content',
	'paraphrase',
	'seo',
	'summarize',
]);

export const prompt = pgTable(
	'prompt',
	{
		id: varchar('id', { length: 191 }).notNull().primaryKey(),
		userId: varchar('user_id', { length: 191 }).notNull(),
		service: serviceEnum('service'),
		price: integer('price').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
	},
	(prompt) => ({
		userIdIdx: index('user_id_idx').on(prompt.userId),
	})
);
