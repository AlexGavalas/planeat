import {
    Button,
    Group,
    List,
    Stack,
    Text,
    TextInput,
    Textarea,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import {
    type ChangeEventHandler,
    type MouseEventHandler,
    memo,
    useCallback,
    useState,
} from 'react';
import { useQuery, useQueryClient } from 'react-query';

import {
    showErrorNotification,
    showSuccessNotification,
} from '~util/notification';

type OnEdit = (params: string) => void;

type MealResultProps = {
    mealText: string;
    onEdit: OnEdit;
};

const MealResult = memo(({ mealText, onEdit }: MealResultProps) => {
    const { t } = useTranslation();

    const handleEdit = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
        onEdit(mealText);
    }, [onEdit, mealText]);

    return (
        <List.Item>
            {mealText}{' '}
            <Button onClick={handleEdit} size="compact-xs">
                {t('edit')}
            </Button>
        </List.Item>
    );
});

MealResult.displayName = 'MealResult';

export const MealPool = () => {
    const { t } = useTranslation();
    const { closeAll } = useModals();
    const queryClient = useQueryClient();
    const [preview, setPreview] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 350);

    const { data: results = [] } = useQuery(
        ['pool-meal', debouncedSearchQuery],
        async () => {
            const response = await fetch(
                `/api/v1/pool/meal?q=${debouncedSearchQuery}`,
            );

            const { data } = (await response.json()) as { data?: string[] };

            return data ?? [];
        },
        {
            enabled: Boolean(debouncedSearchQuery),
        },
    );

    const handleCreate = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        const response = await fetch('/api/v1/pool/meal', {
            body: JSON.stringify({ content: preview }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        if (response.ok) {
            closeAll();

            await queryClient.invalidateQueries(['pool-meal']);

            showSuccessNotification({
                message: t('notification.success.message'),
                title: t('notification.success.title'),
            });
        } else {
            showErrorNotification({
                message: t('notification.error.message'),
                title: t('notification.error.title'),
            });
        }
    }, [preview]);

    const handleEdit = useCallback<OnEdit>((previewText) => {
        setPreview(previewText);
    }, []);

    const handlePreviewChange = useCallback<
        ChangeEventHandler<HTMLTextAreaElement>
    >((e) => {
        setPreview(e.currentTarget.value);
    }, []);

    const handleSearchChange = useCallback<
        ChangeEventHandler<HTMLInputElement>
    >((e) => {
        setSearchQuery(e.currentTarget.value);
    }, []);

    return (
        <Stack gap="md">
            <TextInput
                label={t('search')}
                onChange={handleSearchChange}
                placeholder={t('search_placeholder')}
            />
            <List withPadding spacing="md">
                {results.map((result) => (
                    <MealResult
                        key={result}
                        mealText={result}
                        onEdit={handleEdit}
                    />
                ))}
            </List>
            <Stack gap="md">
                <Text>{t('preview')}</Text>
                <Textarea
                    autosize
                    withAsterisk
                    minRows={3}
                    onChange={handlePreviewChange}
                    value={preview}
                />
            </Stack>
            <Group gap="md" justify="end">
                <Button color="red" onClick={closeAll}>
                    {t('cancel')}
                </Button>
                <Button onClick={handleCreate}>{t('save')}</Button>
            </Group>
        </Stack>
    );
};
