import { ModalsProvider } from '@mantine/modals';
import { type PropsWithChildren } from 'react';

import { renderWithUser, screen } from '~test/utils';
import { type Meal } from '~types/meal';

import { CellOverlay } from './overlay';

const meal: Meal = {
    day: '2026-01-12',
    id: 'meal-id',
    meal: 'Client meal',
    note: 'Client note',
    rating: 4,
    section_key: 'morning_12/01/2026',
    user_id: 1,
};

const Wrapper = ({ children }: PropsWithChildren) => (
    <ModalsProvider>{children}</ModalsProvider>
);
const handleDelete = jest.fn();
const handleSave = jest.fn();

describe('<CellOverlay />', () => {
    it('hides note and rating actions for delegated meal plans', () => {
        expect.hasAssertions();

        renderWithUser(
            <CellOverlay
                canEditAnnotations={false}
                meal={meal}
                onDelete={handleDelete}
                onSave={handleSave}
            />,
            { Wrapper },
        );

        expect(
            screen.queryByRole('button', { name: 'Edit note' }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'Rate' }),
        ).not.toBeInTheDocument();
    });

    it('keeps note and rating actions for the meal owner', () => {
        expect.hasAssertions();

        renderWithUser(
            <CellOverlay
                canEditAnnotations
                meal={meal}
                onDelete={handleDelete}
                onSave={handleSave}
            />,
            { Wrapper },
        );

        expect(screen.getByRole('button', { name: 'Edit note' })).toBeVisible();
        expect(screen.getByRole('button', { name: 'Rate' })).toBeVisible();
    });
});
