import { type Measurement, type MeasurementSummary } from '~types/measurement';

export const getMeasurementSummary = (
    weight: readonly Pick<Measurement, 'date' | 'weight'>[],
    fat: readonly Pick<Measurement, 'date' | 'fat_percentage'>[],
): MeasurementSummary => ({
    currentFat: fat.at(-1)?.fat_percentage ?? 0,
    currentWeight: weight.at(-1)?.weight ?? 0,
    fatTimeline: fat.length
        ? fat.map(({ date: x, fat_percentage: y }) => ({ x, y }))
        : null,
    weightTimeline: weight.length
        ? weight.map(({ date: x, weight: y }) => ({ x, y }))
        : null,
});
