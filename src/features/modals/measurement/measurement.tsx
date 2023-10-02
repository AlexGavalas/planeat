import {
    Button,
    Center,
    Group,
    NumberInput,
    type NumberInputProps,
    Space,
    Text,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useModals } from '@mantine/modals';
import { format } from 'date-fns';
import 'dayjs/locale/el';
import { useTranslation } from 'next-i18next';
import { type FormEventHandler, useCallback, useState } from 'react';

import { showErrorNotification } from '~util/notification';

const localeMap = {
    gr: 'el',
};

type ModalContentProps = {
    onSave?: () => Promise<void>;
    initialData?: {
        id: string;
        date: Date;
        weight?: number;
        fat_percentage?: number;
    };
};

export const MeasurementModal = ({
    onSave,
    initialData,
}: ModalContentProps) => {
    const { t, i18n } = useTranslation();
    const modals = useModals();
    const [date, setDate] = useState<Date | null>(
        initialData?.date ?? new Date(),
    );
    const [weight, setWeight] = useState(initialData?.weight);
    const [fatPercent, setFatPercent] = useState(initialData?.fat_percentage);
    const [error, setError] = useState('');

    const closeModal = useCallback(() => {
        modals.closeAll();
    }, [modals]);

    const resetError = useCallback(() => {
        setError('');
    }, []);

    const handleWeightChange = useCallback<
        NonNullable<NumberInputProps['onChange']>
    >((value) => {
        setWeight(Number(value));
    }, []);

    const handleFatPercentChange = useCallback<
        NonNullable<NumberInputProps['onChange']>
    >((value) => {
        setFatPercent(Number(value));
    }, []);

    const handleSave = useCallback<FormEventHandler<HTMLFormElement>>(
        async (e) => {
            e.preventDefault();

            if (!weight) {
                setError(t('errors.weight_empty'));
                return;
            }

            if (!date) {
                setError(t('errors.date_empty'));
                return;
            }

            const url = initialData?.id
                ? `/api/v1/measurement?id=${initialData.id}`
                : '/api/v1/measurement';

            const response = await fetch(url, {
                body: JSON.stringify({
                    date: format(date, 'yyyy-MM-dd'),
                    fatPercent,
                    weight,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: initialData ? 'PATCH' : 'POST',
            });

            if (!response.ok) {
                showErrorNotification({
                    message: `${t('errors.measurement_save')}. ${t(
                        'try_again',
                    )}`,
                    title: t('error'),
                });
            } else {
                await onSave?.();
                closeModal();
            }
        },
        [closeModal, date, fatPercent, initialData, onSave, t, weight],
    );

    return (
        <form className="calendar" onSubmit={handleSave}>
            <Text>{t('date')}</Text>
            <Center>
                <DatePicker
                    locale={localeMap[i18n.language as keyof typeof localeMap]}
                    onChange={setDate}
                    value={date}
                />
            </Center>
            <Space h={20} />
            <NumberInput
                decimalScale={2}
                error={error}
                label={t('weight')}
                min={0}
                onChange={handleWeightChange}
                onFocus={resetError}
                value={weight}
            />
            <Space h={20} />
            <NumberInput
                decimalScale={2}
                label={t('fat_label')}
                max={100}
                min={0}
                onChange={handleFatPercentChange}
                value={fatPercent}
            />
            <Space h={20} />
            <Group justify="space-between">
                <Button color="red" onClick={closeModal} variant="light">
                    {t('cancel')}
                </Button>
                <Button type="submit">{t('save')}</Button>
            </Group>
        </form>
    );
};
