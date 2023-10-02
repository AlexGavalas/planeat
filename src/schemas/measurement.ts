import { z } from 'zod';

import { type EditedMeasurement } from '~types/measurement';

type MeasurementSchema = z.ZodType<EditedMeasurement>;

export const measurementSchema: MeasurementSchema = z.object({
    date: z.string(),
    fat_percentage: z.number().nullable().optional(),
    id: z.string().optional(),
    user_id: z.number(),
    weight: z.number(),
});

export const patchRequestSchema = z.object({
    date: z.string(),
    fatPercent: z.number(),
    weight: z.number(),
});
