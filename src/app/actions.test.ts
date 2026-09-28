import { revalidatePath } from 'next/cache';

import { acceptConnectionRequest as acceptRequest } from '~api/connection';
import { saveMeals } from '~api/meal';
import { getCurrentUser } from '~api/session';
import { updateProfile } from '~api/user';
import { type User } from '~types/user';

import { acceptConnectionRequest, saveMealPlan, saveProfile } from './actions';

jest.unmock('./actions');
jest.mock<Pick<typeof import('next/cache'), 'revalidatePath'>>(
    'next/cache',
    () => ({
        revalidatePath: jest.fn(),
    }),
);
jest.mock<Pick<typeof import('~api/connection'), 'acceptConnectionRequest'>>(
    '~api/connection',
    () => ({
        acceptConnectionRequest: jest.fn(),
    }),
);
jest.mock<Pick<typeof import('~api/meal'), 'saveMeals'>>('~api/meal', () => ({
    saveMeals: jest.fn(),
}));
jest.mock<Pick<typeof import('~api/session'), 'getCurrentUser'>>(
    '~api/session',
    () => ({
        getCurrentUser: jest.fn(),
    }),
);
jest.mock<Pick<typeof import('~api/user'), 'updateProfile'>>(
    '~api/user',
    () => ({
        updateProfile: jest.fn(),
    }),
);

describe('server actions', () => {
    beforeEach(() => {
        jest.mocked(getCurrentUser).mockResolvedValue({ id: 7 } as User);
    });

    it.each([
        (): Promise<{ ok: boolean }> =>
            saveMealPlan({ deletedIds: [], editedMeals: [], newMeals: [] }),
        (): Promise<{ ok: boolean }> => saveProfile({ height: 180 }),
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
        ]).toStrictEqual([[], [], []]);
    });

    it('rejects malformed input before writing', async () => {
        expect.hasAssertions();
        await expect(
            saveMealPlan({ newMeals: 'invalid' }),
        ).resolves.toStrictEqual({ ok: false });
        await expect(saveProfile({ height: 'invalid' })).resolves.toStrictEqual(
            { ok: false },
        );
        expect(revalidatePath).not.toHaveBeenCalled();
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

    it('returns failure without invalidating pages if the transaction fails', async () => {
        expect.hasAssertions();
        const log = jest
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);
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
