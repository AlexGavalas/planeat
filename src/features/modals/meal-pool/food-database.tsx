import { Button, Group, Stack, Text, Textarea } from '@mantine/core';
import {
    type ChangeEventHandler,
    type MouseEventHandler,
    useCallback,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { FoodDatabaseSearch } from '../meal/food-database-search';
import { useCreateMealPool } from './hooks/use-create-meal-pool';

type FoodDatabaseTabProps = Readonly<{
    onDone: () => void;
}>;

export const FoodDatabaseTab = ({ onDone }: FoodDatabaseTabProps) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState('');
    const {
        mutate,
        isPending: isLoading,
        error,
        reset: resetCreationState,
    } = useCreateMealPool({ onSuccess: onDone });

    const handleCreate = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        mutate({ content: [preview] });
    }, [mutate, preview]);
    const handlePreviewChange = useCallback<
        ChangeEventHandler<HTMLTextAreaElement>
    >((event) => {
        setPreview(event.currentTarget.value);
    }, []);

    return (
        <Stack gap="md">
            <FoodDatabaseSearch onSelect={setPreview} />
            <Stack gap="sm">
                <Text>{t('generic.actions.preview')}</Text>
                <Textarea
                    autosize
                    withAsterisk
                    error={error instanceof Error && error.message}
                    minRows={3}
                    onChange={handlePreviewChange}
                    onFocus={resetCreationState}
                    value={preview}
                />
            </Stack>
            <Group gap="md" justify="end">
                <Button color="danger" disabled={isLoading} onClick={onDone}>
                    {t('generic.actions.cancel')}
                </Button>
                <Button loading={isLoading} onClick={handleCreate}>
                    {t('generic.actions.save')}
                </Button>
            </Group>
        </Stack>
    );
};
