import { renderWithUser } from '~test/utils';
import { type Meal } from '~types/meal';

import { Cell, type CellProps } from './cell';

jest.mock<typeof import('~hooks/use-profile')>('~hooks/use-profile', () => ({
    useProfile: jest.fn().mockReturnValue({}),
}));

jest.mock<typeof import('~store/hooks')>('~store/hooks', () => ({
    ...jest.requireActual<typeof import('~store/hooks')>('~store/hooks'),
    useMeals: jest.fn().mockReturnValue({
        deleteEntryCell: jest.fn(),
        deleteEntryRow: jest.fn(),
        isLoading: false,
        meals: [],
        revert: jest.fn(),
        saveEntryCell: jest.fn(),
        saveEntryRow: jest.fn(),
        savePlan: jest.fn(),
    }),
}));

describe('<Cell />', () => {
    const props: CellProps = {
        id: 'id',
        isEdited: false,
        isRow: false,
        timestamp: new Date(),
    };

    it('renders', () => {
        const { container } = renderWithUser(<Cell {...props} />);

        expect(container).toMatchSnapshot();
    });

    describe('when the user has a meal', () => {
        const meal: Meal = {
            day: '2021-01-01',
            id: 'meal-id',
            meal: 'test meal',
            note: null,
            rating: null,
            section_key: 'section-key',
            user_id: 1,
        };

        const propsWithMeal: CellProps = {
            ...props,
            meal,
        };

        it('renders', () => {
            const { container } = renderWithUser(<Cell {...propsWithMeal} />);

            expect(container).toMatchSnapshot();
        });

        describe('when the meal has a note', () => {
            const propsWithMealNote: CellProps = {
                ...props,
                meal: {
                    ...meal,
                    note: 'test note',
                },
            };

            it('renders', () => {
                const { container } = renderWithUser(
                    <Cell {...propsWithMealNote} />,
                );

                expect(container).toMatchSnapshot();
            });
        });
    });
});
