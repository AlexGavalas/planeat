import { fetchMeals, saveMeals } from '~api/meal';
import { patchRequestSchema } from '~schemas/meal';
import { withUser } from '~util/session';

export const GET = withUser(async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );

    const endDate = String(query.endDate);
    const startDate = String(query.startDate);

    const { data } = await fetchMeals({
        endDate,
        startDate,
        userId: user.id,
    });

    return Response.json({ data });
});

export const PATCH = withUser(async ({ request, user }) => {
    const { deletedIds, editedMeals, newMeals } = patchRequestSchema.parse(
        await request.json(),
    );

    await saveMeals({ deletedIds, editedMeals, newMeals, userId: user.id });

    return Response.json({ message: 'OK' }, { status: 200 });
});
