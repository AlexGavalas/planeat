import { renderWithUser, screen } from '~test/utils';
import { type EditedMealItem } from '~types/meal';

import { MealItemsEditor } from './meal-items-editor';

const item: EditedMealItem = {
    alternative_name: 'Oat flakes',
    basis_grams: 100,
    brand: null,
    calories: 348,
    carbohydrates: 53.3,
    fat: 6.65,
    fiber: 10.983,
    name: 'Hafer Flocken',
    position: 0,
    protein: 13.22,
    provider_food_id: 'C133000',
    quantity_grams: 80,
    salt: 0.00495,
    source: 'bls',
    sugar: 0.74,
};

describe('<MealItemsEditor />', () => {
    it('shows nutrition for each item and the meal total', () => {
        expect.hasAssertions();
        const handleItemsChange = jest.fn();

        renderWithUser(
            <MealItemsEditor
                items={[item]}
                onItemsChange={handleItemsChange}
            />,
        );

        expect(screen.getByText('Meal total')).toBeVisible();
        expect(screen.getAllByText(/278\.4 kcal/)).toHaveLength(2);
        expect(screen.getAllByText(/Fiber 8\.8 g/)).toHaveLength(2);
    });
});
