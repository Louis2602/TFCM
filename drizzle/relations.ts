import { relations } from "drizzle-orm/relations";
import { user, prompt, content, session, template } from "./schema";

export const promptRelations = relations(prompt, ({one}) => ({
	user: one(user, {
		fields: [prompt.user_id],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	prompts: many(prompt),
	contents: many(content),
	sessions: many(session),
	templates: many(template),
}));

export const contentRelations = relations(content, ({one}) => ({
	user: one(user, {
		fields: [content.user_id],
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