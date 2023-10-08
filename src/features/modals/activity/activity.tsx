import { Button, Center, Group, Space, Text, Textarea } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useModals } from '@mantine/modals';
import { format } from 'date-fns';
import 'dayjs/locale/el';
import { useTranslation } from 'next-i18next';
import {
    type ChangeEventHandler,
    type FormEventHandler,
    useCallback,
    useState,
} from 'react';

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

    const closeModal = useCallback(() => {
        modals.closeAll();
    }, [modals]);

    const resetError = useCallback(() => {
        setError('');
    }, []);

    const handleActivityChange = useCallback<
        ChangeEventHandler<HTMLTextAreaElement>
    >((e) => {
        setActivity(e.currentTarget.value);
    }, []);

    const handleSave = useCallback<FormEventHandler<HTMLFormElement>>(
        async (e) => {
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
                body: JSON.stringify({
                    activity,
                    date: format(date, 'yyyy-MM-dd'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: initialData ? 'PATCH' : 'POST',
            });

            if (!response.ok) {
                showErrorNotification({
                    message: `${t('errors.activity_save')}. ${t('try_again')}`,
                    title: t('notification.error.title'),
                });
            } else {
                await onSave?.();
                closeModal();
            }
        },
        [activity, date, initialData, onSave, closeModal, t],
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
            <Textarea
                autosize
                defaultValue={activity}
                error={error}
                label={t('activity.label')}
                minRows={4}
                onChange={handleActivityChange}
                onFocus={resetError}
                placeholder={t('activity.placeholder')}
            />
            <Space h={20} />
            <Group gap="md" justify="space-between">
                <Button color="red" onClick={closeModal} variant="light">
                    {t('generic.actions.cancel')}
                </Button>
                <Button type="submit">{t('generic.actions.save')}</Button>
            </Group>
        </form>
    );
};
