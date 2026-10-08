import { Button, List } from '@mantine/core';
import { type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export type OnMealEdit = (meal: string) => void;

type MealResultProps = Readonly<{
    mealText: string;
    onEdit: OnMealEdit;
}>;

export const MealResult = ({ mealText, onEdit }: MealResultProps) => {
    const { t } = useTranslation();

    const handleEdit = (() => {
        onEdit(mealText);
    }) satisfies MouseEventHandler<HTMLButtonElement>;

    return (
        <List.Item>
            {mealText}{' '}
            <Button onClick={handleEdit} size="compact-xs">
                {t('generic.actions.edit')}
            </Button>
        </List.Item>
    );
};
