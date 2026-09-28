import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import type { measurements } from '~db/schema';

export type Measurement = InferSelectModel<typeof measurements>;
export type EditedMeasurement = InferInsertModel<typeof measurements>;

export type MeasurementsMap = Record<string, Measurement | EditedMeasurement>;

export type MeasurementSummary = {
    currentFat: number;
    currentWeight: number;
    fatTimeline: { x: string; y: number | null }[] | null;
    weightTimeline: { x: string; y: number }[] | null;
};
