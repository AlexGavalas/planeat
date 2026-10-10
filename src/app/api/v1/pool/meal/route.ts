import { fetchMealPool, saveMealTemplates } from '~api/meal-pool';
import { requireMealPlanAccess } from '~api/professional';
import { postRequestSchema } from '~schemas/meal-pool';
import { withUser } from '~util/session';

export const GET = withUser(async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );

    const { q } = query;
    const ownerUserId = query.ownerUserId ? Number(query.ownerUserId) : user.id;

    if (!Number.isSafeInteger(ownerUserId) || ownerUserId <= 0) {
        return Response.json({ message: 'Bad Request' }, { status: 400 });
    }
    const shouldIncludeClient =
        query.includeClient === 'true' && ownerUserId !== user.id;

    if (shouldIncludeClient) {
        await requireMealPlanAccess({
            actorUserId: user.id,
            ownerUserId,
        });

        const [own, client] = await Promise.all([
            fetchMealPool({ q: String(q), userId: user.id }),
            fetchMealPool({ q: String(q), userId: ownerUserId }),
        ]);

        return Response.json({
            data: {
                client,
                own,
            },
        });
    }

    const data = await fetchMealPool({
        q: String(q),
        userId: user.id,
    });

    return Response.json({
        data,
    });
});

export const POST = withUser(async ({ request, user }) => {
    const { templates } = postRequestSchema.parse(await request.json());

    await saveMealTemplates({
        templates,
        userId: user.id,
    });

    return Response.json({ message: 'OK' }, { status: 200 });
});
