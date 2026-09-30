import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import type { notifications } from '~db/schema';
import type { User } from '~types/user';

export type Notification = InferSelectModel<typeof notifications>;
export type EditedNotification = InferInsertModel<typeof notifications>;
export type NotificationWithUser = Notification & {
    users: Pick<User, 'full_name'>;
};

export type NotificationsMap = Record<
    string,
    Notification | EditedNotification
>;
