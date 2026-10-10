import { Badge, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { type EditedMeal, type Meal } from '~types/meal';

import { NutritionSummary } from './nutrition-summary';

type MobileMealDetailsProps = Readonly<{
    meal?: Meal | EditedMeal;
}>;

export const MobileMealDetails = ({ meal }: MobileMealDetailsProps) => {
    const { t } = useTranslation();

    return (
        <Group gap="xs">
            {meal?.note && (
                <Badge size="xs" variant="light">
                    {t('note')}
                </Badge>
            )}
            {meal?.rating && (
                <Badge size="xs" variant="light">
                    {t('rating')}: {meal.rating}/5
                </Badge>
            )}
            {meal?.items?.length ? (
                <NutritionSummary compact meals={[meal]} />
            ) : null}
        </Group>
    );
};
