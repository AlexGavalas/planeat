import { Button, List } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { type MouseEventHandler, memo, useCallback } from 'react';

export type OnEdit = (params: string) => void;

type SearchResultProps = {
    mealText: string;
    onEdit: OnEdit;
};

export const SearchResult = memo(({ mealText, onEdit }: SearchResultProps) => {
    const { t } = useTranslation();

    const handleEdit = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
        onEdit(mealText);
    }, [onEdit, mealText]);

    return (
        <List.Item
            styles={{
                itemWrapper: {
                    width: 'calc(100% - 19px)',
                },
            }}
        >
            <Button onClick={handleEdit} size="compact-xs">
                {t('generic.actions.edit')}
            </Button>{' '}
            {mealText}
        </List.Item>
    );
});

SearchResult.displayName = 'SearchResult';
