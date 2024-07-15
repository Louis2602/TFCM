import { sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  index,
  integer,
  timestamp,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";

export const user = pgTable(
  "user",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }),
    password: text("password").notNull(),
    picture: text("picture"),
    credits: integer("credits").default(30).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (user) => ({
    emailIdx: index("email_idx").on(user.email),
  }),
);

export const session = pgTable("session", {
  id: varchar("id", { length: 191 }).notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const serviceEnum = pgEnum("service", [
  "grammar",
  "content",
  "paraphrase",
  "seo",
  "summarize",
]);

export const prompt = pgTable(
  "prompt",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    service: serviceEnum("service"),
    price: integer("price").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (prompt) => ({
    userIdIdx: index("prompt_user_id_idx").on(prompt.userId),
  }),
);

export const stateEnum = pgEnum("state", ["private", "public"]);

export const content = pgTable(
  "content",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    title: text("title").notNull(),
    body: text("body").notNull(),
    state: stateEnum("state").default("private").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (content) => ({
    userIdIdx: index("content_user_id_idx").on(content.userId),
  }),
);

export const template = pgTable(
  "template",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    title: text("title").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (template) => ({
    userIdIdx: index("template_user_id_idx").on(template.userId)
  }),
);
