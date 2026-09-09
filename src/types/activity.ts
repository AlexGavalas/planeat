import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import { activities } from '~db/schema';

export type Activity = InferSelectModel<typeof activities>;
export type EditedActivity = InferInsertModel<typeof activities>;

export type ActivitysMap = Record<string, Activity | EditedActivity>;
