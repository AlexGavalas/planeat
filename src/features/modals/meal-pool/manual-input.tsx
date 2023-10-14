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
import { useTranslation } from 'next-i18next';
import {
    type ChangeEventHandler,
    type MouseEventHandler,
    useCallback,
    useState,
} from 'react';

import { useCreateMealPool } from './hooks/use-create-meal-pool';
import { useGetMealPool } from './hooks/use-get-meal-pool';
import { type OnEdit, SearchResult } from './search-result';

type ManualInputTabProps = {
    onDone: () => void;
};

export const ManualInputTab = ({ onDone }: ManualInputTabProps) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 350);

    const { data: results = [] } = useGetMealPool({
        searchQuery: debouncedSearchQuery,
    });

    const {
        mutate,
        isLoading,
        error,
        reset: resetCreationState,
    } = useCreateMealPool({
        onSuccess: onDone,
    });

    const handleCreate = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        mutate({ content: [preview] });
    }, [mutate, preview]);

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
        <Stack gap="sm">
            <TextInput
                label={t('generic.search.label')}
                onChange={handleSearchChange}
                placeholder={t('generic.search.placeholder')}
            />
            <List spacing="md">
                {results.map((result) => (
                    <SearchResult
                        key={result}
                        mealText={result}
                        onEdit={handleEdit}
                    />
                ))}
            </List>
            <Stack gap="md">
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
                <Button color="red" disabled={isLoading} onClick={onDone}>
                    {t('generic.actions.cancel')}
                </Button>
                <Button loading={isLoading} onClick={handleCreate}>
                    {t('generic.actions.save')}
                </Button>
            </Group>
        </Stack>
    );
};
