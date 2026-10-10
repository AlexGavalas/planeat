import { renderWithUser, screen } from '~test/utils';
import { type Meal } from '~types/meal';

import { TodayMeals } from './home-meals';
import { type MealItem } from './home-types';

const structuredMeal: Meal = {
    day: '2026-10-10',
    id: 'meal-id',
    items: [
        {
            alternative_name: 'Oat flakes',
            basis_grams: 100,
            brand: null,
            calories: 348,
            carbohydrates: 53.3,
            fat: 6.65,
            fiber: 10.983,
            id: 'item-id',
            name: 'Hafer Flocken',
            position: 0,
            protein: 13.22,
            provider_food_id: 'C133000',
            quantity_grams: 80,
            salt: 0.00495,
            source: 'bls',
            sugar: 0.74,
        },
    ],
    meal: 'Porridge',
    note: null,
    rating: null,
    section_key: 'morning_Sat 10/10/2026',
    user_id: 1,
};

const structuredMealItem: MealItem = {
    key: 'morning',
    meal: structuredMeal.meal,
    mealRecord: structuredMeal,
    time: '08:00',
};
const freeTextMealItem: MealItem = {
    key: 'snack1',
    meal: 'Free-text snack',
    time: '10:00',
};
const mealItems = [structuredMealItem, freeTextMealItem];

describe('<TodayMeals />', () => {
    it('expands nutrition for a structured meal', async () => {
        expect.hasAssertions();

        const { user } = renderWithUser(
            <TodayMeals
                day="2026-10-10"
                mealItems={mealItems}
                nextMealIndex={0}
            />,
        );
        const toggle = screen.getByRole('button', {
            name: 'Show nutrition details',
        });

        await user.click(toggle);

        expect(toggle).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText('278.4 kcal')).toBeVisible();
        expect(screen.queryByText('Calories by meal')).not.toBeInTheDocument();
    });

    it('does not offer nutrition details for a free-text meal', () => {
        expect.hasAssertions();

        renderWithUser(
            <TodayMeals
                day="2026-10-10"
                mealItems={[freeTextMealItem]}
                nextMealIndex={0}
            />,
        );

        expect(
            screen.queryByRole('button', { name: 'Show nutrition details' }),
        ).not.toBeInTheDocument();
    });
});
