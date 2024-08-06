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

export const userRole = pgEnum("user_role", ["admin", "user"]);

export const user = pgTable(
  "user",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }),
    password: text("password").notNull(),
    picture: text("picture"),
    credits: integer("credits").default(30).notNull(),
    role: userRole("role").default("user").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (user) => ({
    emailIdx: index("email_idx").on(user.email),
  })
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
  })
);

export const stateEnum = pgEnum("state", ["private", "public"]);

export const reviewedStatus = pgEnum("status", [
  "pending",
  "accepted",
  "declined",
]);

export const content = pgTable(
  "content",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    title: text("title").notNull(),
    body: text("body").notNull(),
    outline: text("outline"),
    seoKeyword: text("seo_keyword"),
    categoryId: varchar("category_id", { length: 191 }).references(
      () => category.id
    ),
    state: stateEnum("state").default("private").notNull(),
    status: reviewedStatus("status").default("pending").notNull(),
    reviewComment: text("review_comment"),
    reviewedAt: timestamp("reviewed_at"),
    reviewedBy: text("reviewed_by").references(() => user.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (content) => ({
    userIdIdx: index("content_user_id_idx").on(content.userId),
    reviewedByIdx: index("content_reviewed_by_idx").on(content.reviewedBy),
  })
);

export const category = pgTable(
  "category",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    name: varchar("name", { length: 191 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (category) => ({
    userIdIdx: index("category_user_id_idx").on(category.userId),
  })
);

export const trending = pgTable(
  "seo-wizard",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    title: text("title").notNull(),
    used: integer("used").notNull().default(0),
    category: text("category").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (trending) => ({
    userIdIdx: index("trending_user_id_idx").on(trending.userId),
  })
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
    userIdIdx: index("template_user_id_idx").on(template.userId),
  })
);

export const kanban = pgTable("task_board", {
  id: varchar("id", { length: 191 }).notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
});

export const kanbanColumn = pgTable("kanban_column", {
  id: varchar("id", { length: 191 }).notNull().primaryKey(),
  boardId: text("board_id")
    .notNull()
    .references(() => kanban.id, { onDelete: "cascade" }),
  index: integer("index").notNull(),
  name: text("name").notNull(),
});

export const task = pgTable("kanban_task", {
  id: varchar("id", { length: 191 }).notNull().primaryKey(),
  columnId: text("column_id")
    .notNull()
    .references(() => kanbanColumn.id, { onDelete: "cascade" }),
  boardId: text("board_id")
    .notNull()
    .references(() => kanban.id, { onDelete: "cascade" }),
  asignee: text("assignee").references(() => user.id),
  index: integer("index").notNull(),
  name: text("name").notNull(),
  description: text("description"),
});
