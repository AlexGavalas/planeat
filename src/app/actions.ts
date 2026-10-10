'use server';

import { addWeeks, format, startOfWeek } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { acceptConnectionRequest as acceptRequest } from '~api/connection';
import { saveMeals } from '~api/meal';
import { saveMealZoneTimes as saveZoneTimes } from '~api/meal-zone';
import { requireMealPlanAccess } from '~api/professional';
import { getCurrentUser, getRequestDate } from '~api/session';
import { updateProfile } from '~api/user';
import { patchRequestSchema as mealSchema } from '~schemas/meal';
import { mealZoneTimesRequestSchema } from '~schemas/meal-zone';
import { patchRequestSchema as profileSchema } from '~schemas/user';

import {
    type ProfessionalActionResult,
    acceptProfessionalInvitation as acceptProfessionalInvitationAction,
    inviteProfessional as inviteProfessionalAction,
    removeProfessionalRelationship as removeProfessionalRelationshipAction,
    setProfessionalDiscoverable as setProfessionalDiscoverableAction,
    setProfessionalRole as setProfessionalRoleAction,
} from './professional-actions';

export async function acceptProfessionalInvitation(
    input: unknown,
): Promise<ProfessionalActionResult> {
    return acceptProfessionalInvitationAction(input);
}

export async function inviteProfessional(
    input: unknown,
): Promise<ProfessionalActionResult> {
    return inviteProfessionalAction(input);
}

export async function removeProfessionalRelationship(
    input: unknown,
): Promise<ProfessionalActionResult> {
    return removeProfessionalRelationshipAction(input);
}

export async function setProfessionalDiscoverable(
    input: unknown,
): Promise<ProfessionalActionResult> {
    return setProfessionalDiscoverableAction(input);
}

export async function setProfessionalRole(
    input: unknown,
): Promise<ProfessionalActionResult> {
    return setProfessionalRoleAction(input);
}

export async function saveMealPlan(input: unknown): Promise<{ ok: boolean }> {
    const user = await getCurrentUser();

    if (!user) {
        return { ok: false };
    }

    const parsed = mealSchema
        .extend({ ownerUserId: z.number().int().positive().optional() })
        .safeParse(input);

    if (!parsed.success) {
        return { ok: false };
    }

    try {
        const { ownerUserId = user.id, ...plan } = parsed.data;
        await requireMealPlanAccess({
            actorUserId: user.id,
            ownerUserId,
        });
        await saveMeals({
            ...plan,
            ...(ownerUserId !== user.id && { allowAnnotations: false }),
            userId: ownerUserId,
        });
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

    const parsed = mealZoneTimesRequestSchema
        .extend({ ownerUserId: z.number().int().positive().optional() })
        .safeParse(input);

    if (!parsed.success) {
        return { ok: false };
    }

    const effectiveFrom = format(
        addWeeks(startOfWeek(await getRequestDate(), { weekStartsOn: 1 }), 1),
        'yyyy-MM-dd',
    );

    try {
        const ownerUserId = parsed.data.ownerUserId ?? user.id;
        await requireMealPlanAccess({
            actorUserId: user.id,
            ownerUserId,
        });
        await saveZoneTimes({
            effectiveFrom,
            times: parsed.data.times,
            userId: ownerUserId,
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
