import { format, parseISO } from 'date-fns';
import { type TFunction } from 'i18next';

import { type Header } from '~components/table/row';
import { type Measurement } from '~types/measurement';

export const getMeasurementHeaders = (t: TFunction): Header<Measurement>[] => [
    {
        formatValue: (item) => format(parseISO(item.date), 'dd/MM/yy'),
        key: 'date',
        label: t('date'),
        width: '25%',
    },
    {
        key: 'weight',
        label: t('weight'),
        width: '20%',
    },
    {
        formatValue: (item) =>
            item.fat_percentage ? `${item.fat_percentage}%` : '-',
        key: 'fat',
        label: t('fat_label'),
        width: '20%',
    },
    {
        key: 'actions',
        label: t('actions'),
        width: '35%',
    },
];
