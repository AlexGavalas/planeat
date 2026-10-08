'use server';

import { addWeeks, format, startOfWeek } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { acceptConnectionRequest as acceptRequest } from '~api/connection';
import { saveMeals } from '~api/meal';
import { saveMealZoneTimes as saveZoneTimes } from '~api/meal-zone';
import {
    ProfessionalError,
    acceptProfessionalInvitation as acceptProfessional,
    inviteProfessional as createProfessionalInvitation,
    removeProfessionalRelationship as removeProfessional,
    requireMealPlanAccess,
    setProfessionalDiscoverable as updateProfessionalDiscoverability,
    setProfessionalRole as updateProfessionalRole,
} from '~api/professional';
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
        addWeeks(startOfWeek(getRequestDate(), { weekStartsOn: 1 }), 1),
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

type ProfessionalActionResult = {
    error?: string;
    ok: boolean;
};

const professionalActionError = (error: unknown): ProfessionalActionResult => {
    if (error instanceof ProfessionalError) {
        return { error: error.code, ok: false };
    }

    console.error(error);
    return { error: 'unknown', ok: false };
};

export async function setProfessionalRole(
    input: unknown,
): Promise<ProfessionalActionResult> {
    const user = await getCurrentUser();
    const parsed = z.object({ enabled: z.boolean() }).safeParse(input);

    if (!user || !parsed.success) {
        return { ok: false };
    }

    try {
        await updateProfessionalRole({
            enabled: parsed.data.enabled,
            userId: user.id,
        });
        revalidatePath('/', 'layout');
        revalidatePath('/connections');
        revalidatePath('/professional');
        return { ok: true };
    } catch (error) {
        return professionalActionError(error);
    }
}

export async function setProfessionalDiscoverable(
    input: unknown,
): Promise<ProfessionalActionResult> {
    const user = await getCurrentUser();
    const parsed = z.object({ discoverable: z.boolean() }).safeParse(input);

    if (!user || !parsed.success) {
        return { ok: false };
    }

    try {
        await updateProfessionalDiscoverability({
            discoverable: parsed.data.discoverable,
            userId: user.id,
        });
        revalidatePath('/', 'layout');
        revalidatePath('/connections');
        return { ok: true };
    } catch (error) {
        return professionalActionError(error);
    }
}

export async function inviteProfessional(
    input: unknown,
): Promise<ProfessionalActionResult> {
    const user = await getCurrentUser();
    const parsed = z
        .object({ professionalUserId: z.number().int().positive() })
        .safeParse(input);

    if (!user || !parsed.success) {
        return { ok: false };
    }

    try {
        await createProfessionalInvitation({
            clientUserId: user.id,
            professionalUserId: parsed.data.professionalUserId,
        });
        revalidatePath('/connections');
        return { ok: true };
    } catch (error) {
        return professionalActionError(error);
    }
}

export async function acceptProfessionalInvitation(
    input: unknown,
): Promise<ProfessionalActionResult> {
    const user = await getCurrentUser();
    const parsed = z
        .object({ relationshipId: z.string().uuid() })
        .safeParse(input);

    if (!user || !parsed.success) {
        return { ok: false };
    }

    try {
        await acceptProfessional({
            professionalUserId: user.id,
            relationshipId: parsed.data.relationshipId,
        });
        revalidatePath('/connections');
        revalidatePath('/professional');
        return { ok: true };
    } catch (error) {
        return professionalActionError(error);
    }
}

export async function removeProfessionalRelationship(
    input: unknown,
): Promise<ProfessionalActionResult> {
    const user = await getCurrentUser();
    const parsed = z
        .object({ relationshipId: z.string().uuid() })
        .safeParse(input);

    if (!user || !parsed.success) {
        return { ok: false };
    }

    try {
        await removeProfessional({
            relationshipId: parsed.data.relationshipId,
            userId: user.id,
        });
        revalidatePath('/connections');
        revalidatePath('/professional');
        return { ok: true };
    } catch (error) {
        return professionalActionError(error);
    }
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
