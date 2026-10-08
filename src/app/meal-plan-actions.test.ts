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
