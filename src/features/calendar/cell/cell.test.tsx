import { ModalsProvider } from '@mantine/modals';
import { type ReactNode } from 'react';

import { renderWithUser, screen } from '~test/utils';
import { type Meal } from '~types/meal';

import { Cell, type CellProps } from './cell';

jest.mock('~hooks/use-profile', () => ({
    useProfile: jest.fn().mockReturnValue({}),
}));

jest.mock('~store/hooks', () => ({
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
    const Wrapper = ({ children }: { children: ReactNode }) => (
        <ModalsProvider>{children}</ModalsProvider>
    );
    const props: CellProps = {
        id: 'id',
        isEdited: false,
        timestamp: new Date(),
    };
    const removeGeneratedIds = (container: HTMLElement): void => {
        container.querySelectorAll('[id^="mantine-"]').forEach((element) => {
            element.removeAttribute('id');
        });
    };

    it('renders', () => {
        const { container } = renderWithUser(<Cell {...props} />, { Wrapper });
        removeGeneratedIds(container);

        expect(container).toMatchSnapshot();
    });

    it('reveals the plan action on keyboard focus', async () => {
        expect.hasAssertions();
        const { user } = renderWithUser(<Cell {...props} />, { Wrapper });

        expect(
            screen.queryByRole('button', { name: 'Plan meal' }),
        ).not.toBeInTheDocument();

        await user.tab();

        expect(screen.getByRole('button', { name: 'Plan meal' })).toBeVisible();
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
            const { container } = renderWithUser(<Cell {...propsWithMeal} />, {
                Wrapper,
            });
            removeGeneratedIds(container);

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
                    { Wrapper },
                );
                removeGeneratedIds(container);

                expect(container).toMatchSnapshot();
            });
        });
    });
});
