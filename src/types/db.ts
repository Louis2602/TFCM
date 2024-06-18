import { InferInsertModel } from 'drizzle-orm';
import { user } from '@/db/schema';

export type User = InferInsertModel<typeof user>;
