import { fetchMeals, saveMeals } from '~api/meal';
import { patchRequestSchema } from '~schemas/meal';
import { type RouteHandlerWithUser, withUser } from '~util/session';

const handler: RouteHandlerWithUser = async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );

    if (request.method === 'GET') {
        const endDate = String(query.endDate);
        const startDate = String(query.startDate);

        const { data } = await fetchMeals({
            endDate,
            startDate,
            userId: user.id,
        });

        return Response.json({ data });
    } else if (request.method === 'PATCH') {
        const { deletedIds, editedMeals, newMeals } = patchRequestSchema.parse(
            await request.json(),
        );

        await saveMeals({ deletedIds, editedMeals, newMeals, userId: user.id });

        return Response.json({ message: 'OK' }, { status: 200 });
    } else {
        return Response.json(
            { message: 'Method Not Allowed' },
            { status: 405 },
        );
    }
};

const route = withUser(handler);

export { route as GET, route as PATCH };
