import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import { connections } from '~db/schema';

export type Connection = InferSelectModel<typeof connections>;
export type EditedConnection = InferInsertModel<typeof connections>;

export type ConnectionsMap = Record<string, Connection | EditedConnection>;
