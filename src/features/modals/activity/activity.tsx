import { Button, Center, Group, Space, Text, Textarea } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { endOfDay } from 'date-fns';
import 'dayjs/locale/el';
import { useTranslation } from 'next-i18next';
import { type FormEventHandler, useState } from 'react';

const localeMap = {
    gr: 'el',
};

interface ActivityModalProps {
    onSave?: () => void;
    initialData?: {
        id: string;
        date: Date;
        activity?: string;
    };
}

export const ActivityModal = ({ onSave, initialData }: ActivityModalProps) => {
    const { t, i18n } = useTranslation();
    const modals = useModals();
    const [date, setDate] = useState<Date | null>(
        initialData?.date ?? endOfDay(new Date()),
    );
    const [activity, setActivity] = useState(initialData?.activity);
    const [error, setError] = useState('');

    const closeModal = () => modals.closeAll();

    const handleSave: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!activity) return setError(t('errors.activity_empty'));
        if (!date) return setError(t('errors.date_empty'));

        const url = initialData?.id
            ? `/api/v1/activity?id=${initialData.id}`
            : '/api/v1/activity';

        const response = await fetch(url, {
            method: initialData ? 'PATCH' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                activity,
                date: date.toISOString(),
            }),
        });

        const { error } = await response.json();

        if (error) {
            showNotification({
                title: t('error'),
                message: `${t('errors.activity_save')}. ${t('try_again')}`,
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
            <Textarea
                autosize
                minRows={4}
                defaultValue={activity}
                onChange={(e) => setActivity(e.currentTarget.value)}
                label={t('activity.label')}
                placeholder={t('activity.placeholder')}
                error={error}
                onFocus={() => setError('')}
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
