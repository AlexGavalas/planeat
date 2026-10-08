import {
    fetchProfessionalConnectionState,
    findDiscoverableProfessionals,
} from '~api/professional';
import { withUser } from '~util/session';

export const GET = withUser(async ({ request, user }) => {
    const type = request.nextUrl.searchParams.get('type');

    if (type === 'search') {
        const data = await findDiscoverableProfessionals({
            query: request.nextUrl.searchParams.get('q') ?? '',
            userId: user.id,
        });
        return Response.json({ data });
    }

    if (type === 'connections') {
        return Response.json({
            data: await fetchProfessionalConnectionState(user.id),
        });
    }

    return Response.json({ message: 'Bad Request' }, { status: 400 });
});
