import { HEALTH_RANGE_COLORS } from '~theme';
import { type Section } from '~types/types';

export const SECTIONS = [
    {
        bg: HEALTH_RANGE_COLORS[0],
        key: 'fat1',
        percent: 15,
    },
    {
        bg: HEALTH_RANGE_COLORS[1],
        key: 'fat2',
        percent: 15,
    },
    {
        bg: HEALTH_RANGE_COLORS[2],
        key: 'fat3',
        percent: 10,
    },
    {
        bg: HEALTH_RANGE_COLORS[3],
        key: 'fat4',
        percent: 15,
    },
    {
        bg: HEALTH_RANGE_COLORS[4],
        key: 'fat5',
        percent: 45,
    },
] as const satisfies readonly Section[];

export const MAX_FAT_PERCENT = 40;
