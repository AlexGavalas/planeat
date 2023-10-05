import { type Section } from '~types/types';

export const SECTIONS = [
    {
        bg: '#339af0',
        key: 'bmi1',
        percent: 40,
    },
    {
        bg: '#165b99',
        key: 'bmi2',
        percent: 20,
    },
    {
        bg: '#32ad4c',
        key: 'bmi3',
        percent: 10,
    },
    {
        bg: '#ff7600',
        key: 'bmi4',
        percent: 15,
    },
    {
        bg: '#ff0000',
        key: 'bmi5',
        percent: 15,
    },
] as const satisfies readonly Section[];

export const MAX_BMI = 40;
