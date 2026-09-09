import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import { measurements } from '~db/schema';

export type Measurement = InferSelectModel<typeof measurements>;
export type EditedMeasurement = InferInsertModel<typeof measurements>;

export type MeasurementsMap = Record<string, Measurement | EditedMeasurement>;
