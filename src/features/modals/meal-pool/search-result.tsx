import { Button, List } from '@mantine/core';
import { type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export type OnEdit = (params: string) => void;

type SearchResultProps = Readonly<{
    mealText: string;
    onEdit: OnEdit;
}>;

export const SearchResult = ({ mealText, onEdit }: SearchResultProps) => {
    const { t } = useTranslation();

    const handleEdit = (() => {
        onEdit(mealText);
    }) satisfies MouseEventHandler<HTMLButtonElement>;

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
};
