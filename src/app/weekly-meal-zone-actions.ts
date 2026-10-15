'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { requireMealPlanAccess } from '~api/professional';
import { getCurrentUser } from '~api/session';
import { saveWeeklyMealZones } from '~api/weekly-meal-zone';
import { weeklyMealScheduleSchema } from '~schemas/weekly-meal-zone';

export const saveWeeklyMealSchedule = async (
    input: unknown,
): Promise<{ ok: boolean }> => {
    const user = await getCurrentUser();

    if (!user) {
        return { ok: false };
    }

    const parsed = weeklyMealScheduleSchema
        .extend({ ownerUserId: z.number().int().positive().optional() })
        .safeParse(input);

    if (!parsed.success) {
        return { ok: false };
    }

    try {
        const { ownerUserId = user.id, weekStart, zones } = parsed.data;
        await requireMealPlanAccess({
            actorUserId: user.id,
            ownerUserId,
        });
        await saveWeeklyMealZones({
            userId: ownerUserId,
            weekStart,
            zones,
        });
    } catch (error) {
        console.error(error);
        return { ok: false };
    }

    revalidatePath('/home');
    revalidatePath('/meal-plan');

    return { ok: true };
};
