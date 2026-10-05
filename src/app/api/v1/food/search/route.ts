import { searchFoods } from '~api/food-search';
import { foodDatabaseSearch } from '~flags';
import { foodSearchQuerySchema } from '~schemas/food-search';
import { withUser } from '~util/session';

export const GET = withUser(async ({ request }) => {
    if (!(await foodDatabaseSearch())) {
        return Response.json({ message: 'Not Found' }, { status: 404 });
    }

    const query = foodSearchQuerySchema.parse(
        Object.fromEntries(request.nextUrl.searchParams),
    );

    return Response.json(
        await searchFoods({ country: query.country, query: query.q }),
    );
});
