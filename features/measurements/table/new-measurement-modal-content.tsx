import { Group, Center, Space, Text, NumberInput, Button } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { useModals } from '@mantine/modals';
import { useNotifications } from '@mantine/notifications';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useTranslation } from 'next-i18next';
import { useState, FormEventHandler } from 'react';

import 'dayjs/locale/el';

const localeMap = {
    gr: 'el',
};

interface ModalContentProps {
    userId: string;
    onSave: () => void;
}

export const NewMeasurementModalContent = ({
    userId,
    onSave,
}: ModalContentProps) => {
    const { t, i18n } = useTranslation();

    const modals = useModals();
    const notifications = useNotifications();

    const [date, setDate] = useState(new Date());
    const [weight, setWeight] = useState<number>();
    const [fatPercent, setFatPercent] = useState<number>();
    const [error, setError] = useState('');

    const closeModal = () => modals.closeAll();

    const handleSave: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!weight) return setError(t('errors.weight_empty'));

        const { error } = await supabaseClient
            .from<Measurement>('measurements')
            .insert({
                user_id: userId,
                date: date.toISOString(),
                weight,
                fat_percentage: fatPercent,
            });

        if (error) {
            notifications.showNotification({
                title: t('error'),
                message: `${t('errors.measurement_save')}. ${t('try_again')}`,
                color: 'red',
            });
        } else {
            onSave();
            closeModal();
        }
    };

    return (
        <form onSubmit={handleSave}>
            <Text>{t('date')}</Text>
            <Center>
                <Calendar
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
                onChange={setWeight}
                precision={2}
            />
            <Space h={20} />
            <NumberInput
                label={t('fat_label')}
                error={error}
                onFocus={() => setError('')}
                onChange={setFatPercent}
                precision={2}
            />
            <Space h={20} />
            <Group position="apart">
                <Button variant="light" color="red" onClick={closeModal}>
                    {t('cancel')}
                </Button>
                <Button type="submit">{t('save')}</Button>
            </Group>
        </form>
    );
};
