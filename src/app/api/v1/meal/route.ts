import { z } from 'zod';

import { fetchMeals, saveMeals } from '~api/meal';
import { requireMealPlanAccess } from '~api/professional';
import { patchRequestSchema } from '~schemas/meal';
import { withUser } from '~util/session';

export const GET = withUser(async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );

    const endDate = String(query.endDate);
    const startDate = String(query.startDate);
    const ownerUserId = query.ownerUserId ? Number(query.ownerUserId) : user.id;

    if (!Number.isSafeInteger(ownerUserId) || ownerUserId <= 0) {
        return Response.json({ message: 'Bad Request' }, { status: 400 });
    }

    await requireMealPlanAccess({
        actorUserId: user.id,
        ownerUserId,
    });

    const { data } = await fetchMeals({
        endDate,
        startDate,
        userId: ownerUserId,
    });

    return Response.json({ data });
});

export const PATCH = withUser(async ({ request, user }) => {
    const {
        deletedIds,
        editedMeals,
        newMeals,
        ownerUserId = user.id,
    } = patchRequestSchema
        .extend({ ownerUserId: z.number().int().positive().optional() })
        .parse(await request.json());

    await requireMealPlanAccess({ actorUserId: user.id, ownerUserId });

    await saveMeals({
        ...(ownerUserId !== user.id && { allowAnnotations: false }),
        deletedIds,
        editedMeals,
        newMeals,
        userId: ownerUserId,
    });

    return Response.json({ message: 'OK' }, { status: 200 });
});
