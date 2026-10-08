'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import {
    ProfessionalError,
    acceptProfessionalInvitation as acceptProfessional,
    inviteProfessional as createProfessionalInvitation,
    removeProfessionalRelationship as removeProfessional,
    setProfessionalDiscoverable as updateProfessionalDiscoverability,
    setProfessionalRole as updateProfessionalRole,
} from '~api/professional';
import { getCurrentUser } from '~api/session';

export type ProfessionalActionResult = {
    error?: string;
    ok: boolean;
};

const actionError = (error: unknown): ProfessionalActionResult => {
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
        return actionError(error);
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
        return actionError(error);
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
        return actionError(error);
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
        return actionError(error);
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
        return actionError(error);
    }
}
