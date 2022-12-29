import { Button, Center, Group, NumberInput, Space, Text } from '@mantine/core';
import { Calendar } from '@mantine/dates';
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
    userId: string;
    onSave: () => void;
}

export const NewMeasurementModalContent = ({
    userId,
    onSave,
}: ModalContentProps) => {
    const { t, i18n } = useTranslation();
    const supabaseClient = useSupabaseClient<Database>();

    const modals = useModals();

    const [date, setDate] = useState<Date | null>(new Date());
    const [weight, setWeight] = useState<number>();
    const [fatPercent, setFatPercent] = useState<number>();
    const [error, setError] = useState('');

    const closeModal = () => modals.closeAll();

    const handleSave: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!weight) return setError(t('errors.weight_empty').toString());
        if (!date) return setError(t('errors.date_empty').toString());

        const { error } = await supabaseClient.from('measurements').insert({
            user_id: userId,
            date: date.toISOString(),
            weight,
            fat_percentage: fatPercent,
        });

        if (error) {
            showNotification({
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
