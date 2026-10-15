import { Button, List } from '@mantine/core';
import type { ReactElement } from 'react';
import { type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { type MealTemplate } from '~types/meal-pool';

export type OnEdit = (params: MealTemplate) => void;

type SearchResultProps = Readonly<{
    template: MealTemplate;
    onEdit: OnEdit;
}>;

export const SearchResult = ({
    template,
    onEdit,
}: SearchResultProps): ReactElement => {
    const { t } = useTranslation();

    const handleEdit = ((): void => {
        onEdit(template);
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
            {template.content}
        </List.Item>
    );
};
