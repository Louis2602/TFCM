import { InferInsertModel } from "drizzle-orm";
import { content, template, user } from "@/db/schema";

export type User = InferInsertModel<typeof user>;

export type Content = InferInsertModel<typeof content>;

export type Template = InferInsertModel<typeof template>;

