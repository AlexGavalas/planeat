import { type MealsMap } from '~types/meal';
import { type MealZoneKey, type MealZoneTimes } from '~types/meal-zone';

export type HomeProps = Readonly<{
    dailyMeals: MealsMap;
    date: string;
    fullName: string;
    mealZoneTimes: MealZoneTimes;
    targetWeight: number | null;
}>;

export type MealItem = {
    key: MealZoneKey;
    meal: string | null;
    time: string;
};
