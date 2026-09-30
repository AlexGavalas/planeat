import {
    deleteProfile,
    fetchUserById,
    findUsersByName,
    updateProfile,
} from '~api/user';
import { patchRequestSchema } from '~schemas/user';
import { type RouteHandlerWithUser, withUser } from '~util/session';

const handler: RouteHandlerWithUser = async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );

    if (request.method === 'GET') {
        if (query.type === 'search') {
            const { data } = await findUsersByName({
                fullName: String(query.fullName),
                userId: user.id,
            });

            return Response.json({
                data: data.map(({ full_name, id }) => ({
                    label: full_name,
                    value: String(id),
                })),
            });
        } else if (query.type === 'profile') {
            const { data } = await fetchUserById({
                id: Number(query.id),
            });

            return Response.json({ data });
        } else {
            return Response.json({ data: user });
        }
    } else if (request.method === 'PATCH') {
        const {
            height,
            isDiscoverable,
            language,
            targetWeight,
            hasCompletedOnboarding,
            foodPreferencesNegative,
            foodPreferencesPositive,
        } = patchRequestSchema.parse(await request.json());

        await updateProfile({
            foodPreferencesNegative,
            foodPreferencesPositive,
            hasCompletedOnboarding,
            height,
            isDiscoverable,
            language,
            targetWeight,
            userId: user.id,
        });

        return Response.json({ message: 'OK' }, { status: 200 });
    } else if (request.method === 'DELETE') {
        await deleteProfile({
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

export { route as GET, route as PATCH, route as DELETE };
