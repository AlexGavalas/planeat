import { Paper, Stack, Text, Textarea, Title } from '@mantine/core';
import type { ReactElement } from 'react';
import {
    type ChangeEventHandler,
    type FocusEventHandler,
    type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';

import { type EditedMealItem } from '~types/meal';

import { MealItemsEditor } from './meal-items-editor';

type Props = Readonly<{
    error: string;
    items: EditedMealItem[];
    meal: string;
    onItemsChange: (items: EditedMealItem[]) => void;
    onMealChange: ChangeEventHandler<HTMLTextAreaElement>;
    onMealFocus: FocusEventHandler<HTMLTextAreaElement>;
    sourcePanel?: ReactNode;
}>;

export const MealEditorPanel = ({
    error,
    items,
    meal,
    onItemsChange,
    onMealChange,
    onMealFocus,
    sourcePanel,
}: Props): ReactElement => {
    const { t } = useTranslation();

    return (
        <Stack gap="md">
            <Paper p="md" withBorder>
                <Stack gap="sm">
                    <div>
                        <Title order={3} size="h4">
                            {t('modals.meal_edit.details.title')}
                        </Title>
                        <Text c="dimmed" size="sm">
                            {t('modals.meal_edit.details.helper')}
                        </Text>
                    </div>
                    <Textarea
                        autosize
                        error={error}
                        label={t('modals.meal_edit.details.label')}
                        maxRows={8}
                        minRows={3}
                        name="meal"
                        onChange={onMealChange}
                        onFocus={onMealFocus}
                        placeholder={t('meal_placeholder')}
                        value={meal}
                    />
                </Stack>
            </Paper>

            {sourcePanel}

            <Paper p="md" withBorder>
                <Stack gap="sm">
                    <div>
                        <Title order={3} size="h4">
                            {t('modals.meal_edit.items.title')}
                        </Title>
                        <Text c="dimmed" size="sm">
                            {t('modals.meal_edit.items.helper')}
                        </Text>
                    </div>
                    <MealItemsEditor
                        items={items}
                        onItemsChange={onItemsChange}
                    />
                </Stack>
            </Paper>
        </Stack>
    );
};
