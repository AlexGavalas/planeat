import { revalidatePath } from 'next/cache';

import { acceptConnectionRequest as acceptRequest } from '~api/connection';
import { saveMeals } from '~api/meal';
import { saveMealZoneTimes as saveZoneTimes } from '~api/meal-zone';
import {
    requireMealPlanAccess,
    setProfessionalRole as updateProfessionalRole,
} from '~api/professional';
import { getCurrentUser, getRequestDate } from '~api/session';
import { updateProfile } from '~api/user';
import { type UserProfile } from '~types/user';

import {
    acceptConnectionRequest,
    saveMealPlan,
    saveMealZoneTimes,
    saveProfile,
    setProfessionalRole,
} from './actions';

jest.unmock('./actions');
jest.mock('next/cache');
jest.mock('~api/connection');
jest.mock('~api/meal');
jest.mock('~api/meal-zone');
jest.mock('~api/professional');
jest.mock('~api/session', () => ({
    getCurrentUser: jest.fn(),
    getRequestDate: jest.fn(),
}));
jest.mock('~api/user');

describe('server actions', () => {
    beforeEach(() => {
        jest.mocked(getCurrentUser).mockResolvedValue({
            id: 7,
            professional_is_discoverable: false,
            roles: [],
        } as unknown as UserProfile);
        jest.mocked(getRequestDate).mockReturnValue(
            new Date('2026-10-07T12:00:00Z'),
        );
    });

    it.each([
        (): Promise<{ ok: boolean }> =>
            saveMealPlan({ deletedIds: [], editedMeals: [], newMeals: [] }),
        (): Promise<{ ok: boolean }> => saveProfile({ height: 180 }),
        (): Promise<{ ok: boolean }> =>
            saveMealZoneTimes({
                times: {
                    dinner: '20:00',
                    lunch: '13:00',
                    morning: '09:00',
                    snack1: '11:00',
                    snack2: '17:00',
                },
            }),
        (): Promise<{ ok: boolean }> =>
            acceptConnectionRequest('aa6787bf-7452-4b54-b3c5-0d5588e7a558'),
    ])('rejects unauthenticated mutations (%#)', async (action) => {
        expect.hasAssertions();

        jest.mocked(getCurrentUser).mockResolvedValue(null);

        await expect(action()).resolves.toStrictEqual({ ok: false });

        expect([
            jest.mocked(saveMeals).mock.calls,
            jest.mocked(updateProfile).mock.calls,
            jest.mocked(acceptRequest).mock.calls,
            jest.mocked(saveZoneTimes).mock.calls,
        ]).toStrictEqual([[], [], [], []]);
    });

    it('rejects malformed input before writing', async () => {
        expect.hasAssertions();

        const results = await Promise.all([
            saveMealPlan({ newMeals: 'invalid' }),
            saveProfile({ height: 'invalid' }),
            saveMealZoneTimes({
                times: {
                    dinner: '20:00',
                    lunch: '10:00',
                    morning: '09:00',
                    snack1: '11:00',
                    snack2: '17:00',
                },
            }),
        ]);

        expect(results).toStrictEqual([
            { ok: false },
            { ok: false },
            { ok: false },
        ]);

        expect({
            revalidationCalls: jest.mocked(revalidatePath).mock.calls,
            zoneTimeCalls: jest.mocked(saveZoneTimes).mock.calls,
        }).toStrictEqual({ revalidationCalls: [], zoneTimeCalls: [] });
    });

    it('saves ordered zone times for next Monday and preserves history', async () => {
        expect.hasAssertions();

        const times = {
            dinner: '21:00',
            lunch: '13:30',
            morning: '08:30',
            snack1: '11:00',
            snack2: '17:30',
        };

        await expect(saveMealZoneTimes({ times })).resolves.toStrictEqual({
            effectiveFrom: '2026-10-12',
            ok: true,
        });

        expect(saveZoneTimes).toHaveBeenCalledWith({
            effectiveFrom: '2026-10-12',
            times,
            userId: 7,
        });
        expect(jest.mocked(revalidatePath).mock.calls).toStrictEqual(
            expect.arrayContaining([['/home'], ['/meal-plan'], ['/settings']]),
        );
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

    it('updates the professional role for the authenticated account', async () => {
        expect.hasAssertions();

        await expect(
            setProfessionalRole({ enabled: true }),
        ).resolves.toStrictEqual({ ok: true });

        expect(updateProfessionalRole).toHaveBeenCalledWith({
            enabled: true,
            userId: 7,
        });
        expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
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

    it('passes the request id and authenticated recipient to acceptance', async () => {
        expect.hasAssertions();

        const requestId = 'aa6787bf-7452-4b54-b3c5-0d5588e7a558';

        await expect(acceptConnectionRequest(requestId)).resolves.toStrictEqual(
            { ok: true },
        );

        expect(acceptRequest).toHaveBeenCalledWith({ requestId, userId: 7 });
    });
});
