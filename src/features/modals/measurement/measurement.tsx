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
import { type ContextModalProps } from '@mantine/modals';
import { format } from 'date-fns';
import 'dayjs/locale/el';
import { type FormEventHandler, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
    context,
    id,
    innerProps: { onSave, initialData },
}: ContextModalProps<ModalContentProps>) => {
    const { t, i18n } = useTranslation();
    const [date, setDate] = useState<string | null>(
        format(initialData?.date ?? new Date(), 'yyyy-MM-dd'),
    );
    const [weight, setWeight] = useState(initialData?.weight);
    const [fatPercent, setFatPercent] = useState(initialData?.fat_percentage);
    const [error, setError] = useState('');

    const closeModal = useCallback(() => {
        context.closeContextModal(id);
    }, [context, id]);

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
                    date,
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
                    title: t('notification.error.title'),
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
                    {t('generic.actions.cancel')}
                </Button>
                <Button type="submit">{t('generic.actions.save')}</Button>
            </Group>
        </form>
    );
};
