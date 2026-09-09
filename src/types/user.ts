import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import { users } from '~db/schema';

export type User = InferSelectModel<typeof users>;
export type EditedUser = Partial<InferInsertModel<typeof users>>;
