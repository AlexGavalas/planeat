import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import { notifications } from '~db/schema';

export type Notification = InferSelectModel<typeof notifications>;
export type EditedNotification = InferInsertModel<typeof notifications>;

export type NotificationsMap = Record<
    string,
    Notification | EditedNotification
>;
