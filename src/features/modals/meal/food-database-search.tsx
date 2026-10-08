import {
    Alert,
    Anchor,
    Button,
    Select,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import {
    type ChangeEventHandler,
    type KeyboardEventHandler,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { type FoodSearchCountry } from '~types/food-search';

import styles from './food-database-search.module.css';
import { FoodResult } from './food-result';
import { useFoodSearch } from './hooks/use-food-search';

type FoodDatabaseSearchProps = Readonly<{
    onSelect: (meal: string) => void;
}>;

export const FoodDatabaseSearch = ({
    onSelect: handleSelect,
}: FoodDatabaseSearchProps) => {
    const { t } = useTranslation();
    const [input, setInput] = useState('');
    const [query, setQuery] = useState('');
    const [country, setCountry] = useState<FoodSearchCountry>('de');
    const { data, error, isFetching } = useFoodSearch({ country, query });

    const handleSearch = () => {
        const nextQuery = input.trim();
        if (nextQuery.length >= 2) {
            setQuery(nextQuery);
        }
    };

    const handleInputChange = ((event) => {
        setInput(event.target.value);
    }) satisfies ChangeEventHandler<HTMLInputElement>;

    const handleInputKeyDown = ((event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
    }) satisfies KeyboardEventHandler<HTMLInputElement>;

    const handleCountryChange = (value: string | null) => {
        setCountry((value ?? 'de') as FoodSearchCountry);
    };

    const hasSearched = query.length >= 2 && !isFetching;
    const bls = data?.data.bls ?? [];
    const openFoodFacts = data?.data.openFoodFacts ?? [];

    return (
        <Stack gap="sm">
            <Text size="sm">{t('modals.meal_edit.food_search.helper')}</Text>
            <div className={styles.searchControls}>
                <TextInput
                    label={t('modals.meal_edit.food_search.label')}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder={t('modals.meal_edit.food_search.placeholder')}
                    value={input}
                />

                <Select
                    data={[
                        {
                            label: t(
                                'modals.meal_edit.food_search.countries.de',
                            ),
                            value: 'de',
                        },
                        {
                            label: t(
                                'modals.meal_edit.food_search.countries.gr',
                            ),
                            value: 'gr',
                        },
                        {
                            label: t(
                                'modals.meal_edit.food_search.countries.all',
                            ),
                            value: 'all',
                        },
                    ]}
                    label={t('modals.meal_edit.food_search.country')}
                    onChange={handleCountryChange}
                    value={country}
                />

                <Button
                    className={styles.searchButton}
                    disabled={input.trim().length < 2}
                    loading={isFetching}
                    onClick={handleSearch}
                    type="button"
                >
                    {t('modals.meal_edit.food_search.search')}
                </Button>
            </div>

            {error && (
                <Alert color="red">
                    {t('modals.meal_edit.food_search.error')}
                </Alert>
            )}
            {data?.warnings.includes('open-food-facts-unavailable') && (
                <Alert color="yellow">
                    {t('modals.meal_edit.food_search.off_unavailable')}
                </Alert>
            )}
            {hasSearched &&
                !error &&
                bls.length === 0 &&
                openFoodFacts.length === 0 && (
                    <Text c="dimmed" size="sm">
                        {t('modals.meal_edit.food_search.no_results')}
                    </Text>
                )}

            {bls.length > 0 && (
                <Stack gap={2}>
                    <Text fw={600} size="sm">
                        {t('modals.meal_edit.food_search.bls')}
                    </Text>
                    {bls.map((food) => (
                        <FoodResult
                            key={food.id}
                            food={food}
                            onSelect={handleSelect}
                        />
                    ))}
                </Stack>
            )}
            {openFoodFacts.length > 0 && (
                <Stack gap={2}>
                    <Text fw={600} size="sm">
                        {t('modals.meal_edit.food_search.open_food_facts')}
                    </Text>
                    {openFoodFacts.map((food) => (
                        <FoodResult
                            key={food.id}
                            food={food}
                            onSelect={handleSelect}
                        />
                    ))}
                </Stack>
            )}

            <Text c="dimmed" size="xs">
                {t('modals.meal_edit.food_search.per_100g')}{' '}
                <Anchor
                    href="https://doi.org/10.25826/Data20251217-134202-0"
                    rel="noreferrer"
                    target="_blank"
                >
                    BLS 4.0
                </Anchor>{' '}
                ({t('modals.meal_edit.food_search.bls_credit')}) ·{' '}
                <Anchor
                    href="https://world.openfoodfacts.org/"
                    rel="noreferrer"
                    target="_blank"
                >
                    Open Food Facts
                </Anchor>{' '}
                ({t('modals.meal_edit.food_search.community_data')})
            </Text>
        </Stack>
    );
};
