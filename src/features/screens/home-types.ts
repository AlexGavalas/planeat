import { type EditedMeal, type Meal, type MealsMap } from '~types/meal';
import { type MealZoneKey, type WeeklyMealZone } from '~types/meal-zone';

export type HomeProps = Readonly<{
    dailyMeals: MealsMap;
    date: string;
    fullName: string;
    targetWeight: number | null;
    weeklyMealZones: WeeklyMealZone[];
}>;

export type MealItem = {
    key: string;
    label: string;
    legacyKey?: MealZoneKey;
    meal: string | null;
    mealRecord?: EditedMeal | Meal;
    time: string;
};
