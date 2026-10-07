'use server';

import { addWeeks, format, startOfWeek } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { acceptConnectionRequest as acceptRequest } from '~api/connection';
import { saveMeals } from '~api/meal';
import { saveMealZoneTimes as saveZoneTimes } from '~api/meal-zone';
import { getCurrentUser, getRequestDate } from '~api/session';
import { updateProfile } from '~api/user';
import { patchRequestSchema as mealSchema } from '~schemas/meal';
import { mealZoneTimesRequestSchema } from '~schemas/meal-zone';
import { patchRequestSchema as profileSchema } from '~schemas/user';

export async function saveMealPlan(input: unknown): Promise<{ ok: boolean }> {
    const user = await getCurrentUser();

    if (!user) {
        return { ok: false };
    }

    const parsed = mealSchema.safeParse(input);

    if (!parsed.success) {
        return { ok: false };
    }

    try {
        await saveMeals({ ...parsed.data, userId: user.id });
    } catch (error) {
        console.error(error);
        return { ok: false };
    }

    revalidatePath('/home');
    revalidatePath('/meal-plan');

    return { ok: true };
}

export async function saveMealZoneTimes(
    input: unknown,
): Promise<{ effectiveFrom?: string; ok: boolean }> {
    const user = await getCurrentUser();

    if (!user) {
        return { ok: false };
    }

    const parsed = mealZoneTimesRequestSchema.safeParse(input);

    if (!parsed.success) {
        return { ok: false };
    }

    const effectiveFrom = format(
        addWeeks(startOfWeek(getRequestDate(), { weekStartsOn: 1 }), 1),
        'yyyy-MM-dd',
    );

    try {
        await saveZoneTimes({
            effectiveFrom,
            times: parsed.data.times,
            userId: user.id,
        });
    } catch (error) {
        console.error(error);
        return { ok: false };
    }

    revalidatePath('/home');
    revalidatePath('/meal-plan');
    revalidatePath('/settings');

    return { effectiveFrom, ok: true };
}

export async function saveProfile(input: unknown): Promise<{ ok: boolean }> {
    const user = await getCurrentUser();

    if (!user) {
        return { ok: false };
    }

    const parsed = profileSchema.safeParse(input);

    if (!parsed.success) {
        return { ok: false };
    }

    try {
        await updateProfile({ ...parsed.data, userId: user.id });
    } catch (error) {
        console.error(error);
        return { ok: false };
    }

    revalidatePath('/', 'layout');

    return { ok: true };
}

export async function acceptConnectionRequest(
    input: unknown,
): Promise<{ ok: boolean }> {
    const user = await getCurrentUser();

    const requestId = z.string().uuid().safeParse(input);

    if (!user || !requestId.success) {
        return { ok: false };
    }

    try {
        await acceptRequest({ requestId: requestId.data, userId: user.id });
    } catch (error) {
        console.error(error);
        return { ok: false };
    }

    revalidatePath('/connections');

    return { ok: true };
}
