import { InferInsertModel } from "drizzle-orm";
import { content, category, template, user } from "@/db/schema";

export type User = InferInsertModel<typeof user>;

export type Content = InferInsertModel<typeof content>;

export type Category = InferInsertModel<typeof category>;

export type Template = InferInsertModel<typeof template>;

