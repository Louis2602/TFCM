import { InferInsertModel } from "drizzle-orm";
import {
  content,
  category,
  template,
  user,
  task,
  file,
  folder,
  kanbanColumn,
  reviewedStatus,
} from "@/db/schema";

export type User = InferInsertModel<typeof user>;

export type Content = InferInsertModel<typeof content>;

export type Category = InferInsertModel<typeof category>;

export type Task = InferInsertModel<typeof task>;

export type Folder = InferInsertModel<typeof folder>;

export type File = InferInsertModel<typeof file>;

export type KanbanColumn = InferInsertModel<typeof kanbanColumn>;

export type Template = InferInsertModel<typeof template>;

export type ReviewStatus = (typeof reviewedStatus.enumValues)[number];
