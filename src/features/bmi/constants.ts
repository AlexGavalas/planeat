import { HEALTH_RANGE_COLORS } from '~theme';
import { type Section } from '~types/types';

export const SECTIONS = [
    {
        bg: HEALTH_RANGE_COLORS[0],
        key: 'bmi1',
        percent: 40,
    },
    {
        bg: HEALTH_RANGE_COLORS[1],
        key: 'bmi2',
        percent: 20,
    },
    {
        bg: HEALTH_RANGE_COLORS[2],
        key: 'bmi3',
        percent: 10,
    },
    {
        bg: HEALTH_RANGE_COLORS[3],
        key: 'bmi4',
        percent: 15,
    },
    {
        bg: HEALTH_RANGE_COLORS[4],
        key: 'bmi5',
        percent: 15,
    },
] as const satisfies readonly Section[];

export const MAX_BMI = 40;
