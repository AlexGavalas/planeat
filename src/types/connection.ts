import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import type { connections } from '~db/schema';
import type { User } from '~types/user';

export type Connection = InferSelectModel<typeof connections>;
export type EditedConnection = InferInsertModel<typeof connections>;
export type ConnectionWithUser = Connection & {
    users: Pick<User, 'full_name'>;
};

export type ConnectionsMap = Record<string, Connection | EditedConnection>;
