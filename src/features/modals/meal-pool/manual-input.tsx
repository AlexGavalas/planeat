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

import { type EditedMealItem } from '~types/meal';

import { MealItemsEditor } from '../meal/meal-items-editor';
import { useCreateMealPool } from './hooks/use-create-meal-pool';
import { useGetMealPool } from './hooks/use-get-meal-pool';
import { type OnEdit, SearchResult } from './search-result';

type ManualInputTabProps = Readonly<{
    onDone: () => void;
}>;

export const ManualInputTab = ({ onDone }: ManualInputTabProps) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState('');
    const [templateId, setTemplateId] = useState<number>();
    const [items, setItems] = useState<EditedMealItem[]>([]);
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
        mutate({ templates: [{ content: preview, id: templateId, items }] });
    }) satisfies MouseEventHandler<HTMLButtonElement>;

    const handleEdit = ((template) => {
        setPreview(template.content);
        setTemplateId(template.id);
        setItems(template.items.map(({ id: _id, ...item }) => ({ ...item })));
    }) satisfies OnEdit;

    const handlePreviewChange = ((e) => {
        setPreview(e.target.value);
    }) satisfies ChangeEventHandler<HTMLTextAreaElement>;

    const handleSearchChange = ((e) => {
        setSearchQuery(e.target.value);
    }) satisfies ChangeEventHandler<HTMLInputElement>;
    const handleItemsChange = (nextItems: EditedMealItem[]) => {
        setItems(nextItems);
    };

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
                        key={result.id}
                        template={result}
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
                <MealItemsEditor
                    items={items}
                    onItemsChange={handleItemsChange}
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
