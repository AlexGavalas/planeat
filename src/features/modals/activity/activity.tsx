import { Button, Center, Group, Space, Text, Textarea } from '@mantine/core';
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

type ActivityModalProps = {
    onSave?: () => Promise<void> | void;
    initialData?: {
        id: string;
        date: Date;
        activity?: string;
    };
};

export const ActivityModal = ({ onSave, initialData }: ActivityModalProps) => {
    const { t, i18n } = useTranslation();
    const modals = useModals();
    const [date, setDate] = useState<Date | null>(
        initialData?.date ?? new Date(),
    );
    const [activity, setActivity] = useState(initialData?.activity);
    const [error, setError] = useState('');

    const closeModal = () => {
        modals.closeAll();
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
    const handleSave: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!activity) {
            setError(t('errors.activity_empty'));
            return;
        }

        if (!date) {
            setError(t('errors.date_empty'));
            return;
        }

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
                date: format(date, 'yyyy-MM-dd'),
            }),
        });

        if (!response.ok) {
            showErrorNotification({
                title: t('error'),
                message: `${t('errors.activity_save')}. ${t('try_again')}`,
            });
        } else {
            await onSave?.();
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
                onChange={(e) => {
                    setActivity(e.currentTarget.value);
                }}
                label={t('activity.label')}
                placeholder={t('activity.placeholder')}
                error={error}
                onFocus={() => {
                    setError('');
                }}
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
