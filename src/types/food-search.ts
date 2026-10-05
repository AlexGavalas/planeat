export type FoodSearchCountry = 'all' | 'de' | 'gr';

export type FoodNutrition = {
    calories: number | null;
    carbohydrates: number | null;
    fat: number | null;
    fiber: number | null;
    protein: number | null;
    salt: number | null;
    sugar: number | null;
};

export type FoodSearchResult = {
    alternativeName: string | null;
    brand: string | null;
    id: string;
    name: string;
    nutrition: FoodNutrition;
    quantity: string | null;
    source: 'bls' | 'open-food-facts';
};

export type FoodSearchResponse = {
    data: {
        bls: FoodSearchResult[];
        openFoodFacts: FoodSearchResult[];
    };
    warnings: 'open-food-facts-unavailable'[];
};
