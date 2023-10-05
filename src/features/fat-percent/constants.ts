import { type Section } from '~types/types';

export const SECTIONS = [
    {
        bg: '#339af0',
        key: 'fat1',
        percent: 15,
    },
    {
        bg: '#165b99',
        key: 'fat2',
        percent: 15,
    },
    {
        bg: '#32ad4c',
        key: 'fat3',
        percent: 10,
    },
    {
        bg: '#ff7600',
        key: 'fat4',
        percent: 15,
    },
    {
        bg: '#ff0000',
        key: 'fat5',
        percent: 45,
    },
] as const satisfies readonly Section[];

export const MAX_FAT_PERCENT = 40;
