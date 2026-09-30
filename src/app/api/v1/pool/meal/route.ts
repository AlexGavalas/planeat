import { createMealInPool, fetchMealPool } from '~api/meal-pool';
import { postRequestSchema } from '~schemas/meal-pool';
import { withUser } from '~util/session';

export const GET = withUser(async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );

    const { q } = query;

    const data = await fetchMealPool({
        q: String(q),
        userId: user.id,
    });

    return Response.json({
        data: data.map(({ content }) => content),
    });
});

export const POST = withUser(async ({ request, user }) => {
    const { content } = postRequestSchema.parse(await request.json());

    await createMealInPool({
        content,
        userId: user.id,
    });

    return Response.json({ message: 'OK' }, { status: 200 });
});
