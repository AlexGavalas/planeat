import { revalidatePath } from 'next/cache';

import { saveMeals } from '~api/meal';
import { requireMealPlanAccess } from '~api/professional';
import { getCurrentUser } from '~api/session';
import { type UserProfile } from '~types/user';

import { saveMealPlan } from './actions';

jest.unmock('./actions');
jest.mock('next/cache');
jest.mock('~api/meal');
jest.mock('~api/professional');
jest.mock('~api/session', () => ({
    getCurrentUser: jest.fn(),
    getRequestDate: jest.fn(),
}));

describe('meal plan server actions', () => {
    beforeEach(() => {
        jest.mocked(getCurrentUser).mockResolvedValue({
            id: 7,
            professional_is_discoverable: false,
            roles: [],
        } as unknown as UserProfile);
    });

    it('uses the authenticated identity and invalidates affected pages', async () => {
        expect.hasAssertions();

        await saveMealPlan({
            deletedIds: [],
            editedMeals: [],
            newMeals: [],
            userId: 999,
        });

        expect(saveMeals).toHaveBeenCalledWith({
            deletedIds: [],
            editedMeals: [],
            newMeals: [],
            userId: 7,
        });
        expect(revalidatePath).toHaveBeenCalledWith('/home');
        expect(revalidatePath).toHaveBeenCalledWith('/meal-plan');
    });

    it('allows the meal owner to save notes and ratings', async () => {
        expect.hasAssertions();

        const editedMeal = {
            day: '2026-10-08',
            id: '10accc9d-f0b7-4225-87df-3e91d5639d75',
            meal: 'Porridge',
            note: 'Add honey',
            rating: 5,
            section_key: 'morning_Thu 08/10/2026',
            user_id: 7,
        };

        await expect(
            saveMealPlan({
                deletedIds: [],
                editedMeals: [editedMeal],
                newMeals: [],
            }),
        ).resolves.toStrictEqual({ ok: true });

        expect(saveMeals).toHaveBeenCalledWith({
            deletedIds: [],
            editedMeals: [editedMeal],
            newMeals: [],
            userId: 7,
        });
    });

    it('authorizes a delegated owner before saving their meal plan', async () => {
        expect.hasAssertions();

        await expect(
            saveMealPlan({
                deletedIds: [],
                editedMeals: [],
                newMeals: [],
                ownerUserId: 42,
            }),
        ).resolves.toStrictEqual({ ok: true });

        expect(requireMealPlanAccess).toHaveBeenCalledWith({
            actorUserId: 7,
            ownerUserId: 42,
        });
        expect(saveMeals).toHaveBeenCalledWith({
            allowAnnotations: false,
            deletedIds: [],
            editedMeals: [],
            newMeals: [],
            userId: 42,
        });
    });

    it('returns failure without invalidating pages if the transaction fails', async () => {
        expect.hasAssertions();

        const log = jest.spyOn(console, 'error').mockImplementation(jest.fn());
        jest.mocked(saveMeals).mockRejectedValueOnce(
            new Error('transaction failed'),
        );

        await expect(
            saveMealPlan({ deletedIds: [], editedMeals: [], newMeals: [] }),
        ).resolves.toStrictEqual({ ok: false });

        expect(revalidatePath).not.toHaveBeenCalled();
        log.mockRestore();
    });
});
