import { Button, Center, Group, NumberInput, Space, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import 'dayjs/locale/el';
import { useTranslation } from 'next-i18next';
import { type FormEventHandler, useState } from 'react';

import { type Database } from '~types/supabase';

const localeMap = {
    gr: 'el',
};

interface ModalContentProps {
    userId: number;
    onSave: () => void;
    initialData?: {
        id: string;
        date: Date;
        weight?: number;
        fat_percentage?: number;
    };
}

export const NewMeasurementModalContent = ({
    userId,
    onSave,
    initialData,
}: ModalContentProps) => {
    const { t, i18n } = useTranslation();
    const supabaseClient = useSupabaseClient<Database>();
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

        let error;

        if (initialData) {
            const result = await supabaseClient
                .from('measurements')
                .update({
                    date: date.toISOString(),
                    weight,
                    fat_percentage: fatPercent,
                })
                .eq('id', initialData.id);

            error = result.error;
        } else {
            const result = await supabaseClient.from('measurements').insert({
                user_id: userId,
                date: date.toISOString(),
                weight,
                fat_percentage: fatPercent,
            });

            error = result.error;
        }

        if (error) {
            showNotification({
                title: t('error'),
                message: `${t('errors.measurement_save')}. ${t('try_again')}`,
                color: 'red',
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
                precision={2}
            />
            <Space h={20} />
            <NumberInput
                label={t('fat_label')}
                min={0}
                max={100}
                value={fatPercent}
                onChange={(value) => setFatPercent(Number(value))}
                precision={2}
            />
            <Space h={20} />
            <Group position="apart">
                <Button variant="light" color="red" onClick={closeModal}>
                    {t('cancel')}
                </Button>
                <Button type="submit" className="button">
                    {t('save')}
                </Button>
            </Group>
        </form>
    );
};
