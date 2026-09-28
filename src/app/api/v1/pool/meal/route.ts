import { createMealInPool, fetchMealPool } from '~api/meal-pool';
import { postRequestSchema } from '~schemas/meal-pool';
import { type RouteHandlerWithUser, withUser } from '~util/session';

const handler: RouteHandlerWithUser = async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );
    if (request.method === 'GET') {
        const { q } = query;

        const data = await fetchMealPool({
            q: String(q),
            userId: user.id,
        });

        return Response.json({
            data: data.map(({ content }) => content),
        });
    } else if (request.method === 'POST') {
        const { content } = postRequestSchema.parse(await request.json());

        await createMealInPool({
            content,
            userId: user.id,
        });

        return Response.json({ message: 'OK' }, { status: 200 });
    } else {
        return Response.json(
            { message: 'Method Not Allowed' },
            { status: 405 },
        );
    }
};

const route = withUser(handler);
export { route as GET, route as POST };
