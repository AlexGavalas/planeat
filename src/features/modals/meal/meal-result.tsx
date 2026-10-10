import { Button, List } from '@mantine/core';
import { type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { type MealTemplate } from '~types/meal-pool';

export type OnMealEdit = (meal: MealTemplate) => void;

type MealResultProps = Readonly<{
    template: MealTemplate;
    onEdit: OnMealEdit;
}>;

export const MealResult = ({ template, onEdit }: MealResultProps) => {
    const { t } = useTranslation();

    const handleEdit = (() => {
        onEdit(template);
    }) satisfies MouseEventHandler<HTMLButtonElement>;

    return (
        <List.Item>
            {template.content}{' '}
            <Button onClick={handleEdit} size="compact-xs">
                {t('generic.actions.edit')}
            </Button>
        </List.Item>
    );
};
