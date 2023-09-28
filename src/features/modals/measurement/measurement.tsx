import { Button, Center, Group, NumberInput, Space, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useModals } from '@mantine/modals';
import { format } from 'date-fns';
import 'dayjs/locale/el';
import { useTranslation } from 'next-i18next';
import { type FormEventHandler, useState } from 'react';

import { showErrorNotification } from '~util/notification';

const localeMap = {
    gr: 'el',
};

interface ModalContentProps {
    onSave?: () => void;
    initialData?: {
        id: string;
        date: Date;
        weight?: number;
        fat_percentage?: number;
    };
}

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

    const closeModal = () => modals.closeAll();

    const handleSave: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!weight) return setError(t('errors.weight_empty'));
        if (!date) return setError(t('errors.date_empty'));

        const url = initialData?.id
            ? `/api/v1/measurement?id=${initialData.id}`
            : '/api/v1/measurement';

        const response = await fetch(url, {
            method: initialData ? 'PATCH' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: format(date, 'yyyy-MM-dd'),
                weight,
                fatPercent,
            }),
        });

        const { error } = await response.json();

        if (error) {
            showErrorNotification({
                title: t('error'),
                message: `${t('errors.measurement_save')}. ${t('try_again')}`,
            });
        } else {
            onSave?.();
            closeModal();
        }
    };

    return (
        <form onSubmit={handleSave} className="calendar">
            <Text>{t('date')}</Text>
            <Center>
                <DatePicker
                    value={date}
                    onChange={setDate}
                    locale={localeMap[i18n.language as keyof typeof localeMap]}
                />
            </Center>
            <Space h={20} />
            <NumberInput
                label={t('weight')}
                error={error}
                onFocus={() => setError('')}
                min={0}
                value={weight}
                onChange={(value) => setWeight(Number(value))}
                decimalScale={2}
            />
            <Space h={20} />
            <NumberInput
                label={t('fat_label')}
                min={0}
                max={100}
                value={fatPercent}
                onChange={(value) => setFatPercent(Number(value))}
                decimalScale={2}
            />
            <Space h={20} />
            <Group justify="space-between">
                <Button variant="light" color="red" onClick={closeModal}>
                    {t('cancel')}
                </Button>
                <Button type="submit">{t('save')}</Button>
            </Group>
        </form>
    );
};
