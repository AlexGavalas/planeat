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
import {
    type ChangeEventHandler,
    type MouseEventHandler,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateMealPool } from './hooks/use-create-meal-pool';
import { useGetMealPool } from './hooks/use-get-meal-pool';
import { type OnEdit, SearchResult } from './search-result';

type ManualInputTabProps = Readonly<{
    onDone: () => void;
}>;

export const ManualInputTab = ({ onDone }: ManualInputTabProps) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 350);

    const { data = [] } = useGetMealPool({
        searchQuery: debouncedSearchQuery,
    });
    const results = Array.isArray(data) ? data : data.own;

    const {
        mutate,
        isPending: isLoading,
        error,
        reset: resetCreationState,
    } = useCreateMealPool({
        onSuccess: onDone,
    });

    const handleCreate = (() => {
        mutate({ content: [preview] });
    }) satisfies MouseEventHandler<HTMLButtonElement>;

    const handleEdit = ((previewText) => {
        setPreview(previewText);
    }) satisfies OnEdit;

    const handlePreviewChange = ((e) => {
        setPreview(e.target.value);
    }) satisfies ChangeEventHandler<HTMLTextAreaElement>;

    const handleSearchChange = ((e) => {
        setSearchQuery(e.target.value);
    }) satisfies ChangeEventHandler<HTMLInputElement>;

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
