import {
    ActionIcon,
    Group,
    NumberInput,
    Paper,
    Stack,
    Text,
} from '@mantine/core';
import { Trash } from 'iconoir-react';
import { useTranslation } from 'react-i18next';

import { type EditedMealItem } from '~types/meal';
import { scaleNutrition, totalNutrition } from '~util/nutrition';

type Props = Readonly<{
    items: EditedMealItem[];
    onItemsChange: (items: EditedMealItem[]) => void;
}>;

type RowProps = Readonly<Props & { index: number; item: EditedMealItem }>;

const MealItemRow = ({ index, item, items, onItemsChange }: RowProps) => {
    const { i18n, t } = useTranslation();
    const format = new Intl.NumberFormat(i18n.language, {
        maximumFractionDigits: 1,
    });
    const nutrition = scaleNutrition(item);
    const value = (amount: number | null) =>
        amount === null ? '—' : `${format.format(amount)} g`;
    const handleQuantityChange = (value: number | string) => {
        const quantity = Number(value);
        if (!Number.isFinite(quantity) || quantity <= 0) {
            return;
        }
        onItemsChange(
            items.map((candidate, candidateIndex) =>
                candidateIndex === index
                    ? { ...candidate, quantity_grams: quantity }
                    : candidate,
            ),
        );
    };
    const handleDelete = () => {
        onItemsChange(
            items
                .filter((_, candidateIndex) => candidateIndex !== index)
                .map((candidate, position) => ({ ...candidate, position })),
        );
    };

    return (
        <Group wrap="nowrap">
            <div style={{ flex: 1 }}>
                <Text fw={600} size="sm">
                    {[item.brand, item.name].filter(Boolean).join(' · ')}
                </Text>
                <Text c="dimmed" size="xs">
                    {item.source === 'bls' ? 'BLS 4.0' : 'Open Food Facts'}
                </Text>
                <Text c="dimmed" size="xs">
                    {nutrition.calories === null
                        ? '—'
                        : `${format.format(nutrition.calories)} kcal`}{' '}
                    · P {value(nutrition.protein)} · C{' '}
                    {value(nutrition.carbohydrates)} · F {value(nutrition.fat)}
                </Text>
                <Text c="dimmed" size="xs">
                    {t('nutrition.fiber')} {value(nutrition.fiber)} ·{' '}
                    {t('nutrition.sugar')} {value(nutrition.sugar)} ·{' '}
                    {t('nutrition.salt')} {value(nutrition.salt)}
                </Text>
            </div>
            <NumberInput
                allowDecimal
                allowNegative={false}
                min={1}
                onChange={handleQuantityChange}
                suffix=" g"
                value={item.quantity_grams}
                w={120}
            />
            <ActionIcon
                aria-label={t('generic.actions.delete')}
                color="danger"
                onClick={handleDelete}
                variant="subtle"
            >
                <Trash />
            </ActionIcon>
        </Group>
    );
};

export const MealItemsEditor = ({ items, onItemsChange }: Props) => {
    const { i18n, t } = useTranslation();
    const format = new Intl.NumberFormat(i18n.language, {
        maximumFractionDigits: 1,
    });
    const totals = totalNutrition(items);

    return (
        <Stack gap="xs">
            {items.map((item, index) => (
                <MealItemRow
                    index={index}
                    item={item}
                    items={items}
                    key={`${item.source}:${item.provider_food_id}:${index}`}
                    onItemsChange={onItemsChange}
                />
            ))}
            {items.length > 0 && (
                <Paper p="sm" withBorder>
                    <Text fw={600} mb={4} size="sm">
                        {t('nutrition.meal_total')}
                    </Text>
                    <Text size="sm">
                        {totals.calories === null
                            ? t('nutrition.incomplete')
                            : `${format.format(totals.calories)} kcal`}{' '}
                        · P{' '}
                        {totals.protein === null
                            ? '—'
                            : `${format.format(totals.protein)} g`}
                        {' · '}C{' '}
                        {totals.carbohydrates === null
                            ? '—'
                            : `${format.format(totals.carbohydrates)} g`}
                        {' · '}F{' '}
                        {totals.fat === null
                            ? '—'
                            : `${format.format(totals.fat)} g`}
                    </Text>
                    <Text c="dimmed" size="xs">
                        {t('nutrition.fiber')}{' '}
                        {totals.fiber === null
                            ? '—'
                            : `${format.format(totals.fiber)} g`}
                        {' · '}
                        {t('nutrition.sugar')}{' '}
                        {totals.sugar === null
                            ? '—'
                            : `${format.format(totals.sugar)} g`}
                        {' · '}
                        {t('nutrition.salt')}{' '}
                        {totals.salt === null
                            ? '—'
                            : `${format.format(totals.salt)} g`}
                    </Text>
                </Paper>
            )}
        </Stack>
    );
};
