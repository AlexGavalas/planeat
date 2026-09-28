import {
    deleteMeasurement,
    fetchFatMeasurements,
    fetchLatestFatMeasurement,
    fetchLatestWeightMeasurement,
    fetchMeasurementSummary,
    fetchMeasurements,
    fetchMeasurementsCount,
    fetchMeasurementsPaginated,
    updateMeasurement,
} from '~api/measurement';
import { patchRequestSchema } from '~schemas/measurement';
import { type RouteHandlerWithUser, withUser } from '~util/session';

const handler: RouteHandlerWithUser = async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );
    if (request.method === 'GET') {
        if (query.type === 'summary') {
            return Response.json({
                data: await fetchMeasurementSummary({ userId: user.id }),
            });
        } else if (query.type === 'latest-weight') {
            const { data } = await fetchLatestWeightMeasurement({
                userId: user.id,
            });
            return Response.json({ data: data[0]?.weight ?? 0 });
        } else if (query.type === 'latest-fat') {
            const { data } = await fetchLatestFatMeasurement({
                userId: user.id,
            });
            return Response.json({ data: data[0]?.fat_percentage ?? 0 });
        } else if (query.type === 'weight-timeline') {
            const { data } = await fetchMeasurements({ userId: user.id });
            return Response.json({ data });
        } else if (query.type === 'fat-timeline') {
            const { data } = await fetchFatMeasurements({ userId: user.id });
            return Response.json({ data });
        } else if (query.count === 'true') {
            const count = await fetchMeasurementsCount({
                userId: user.id,
            });

            return Response.json({ count });
        } else {
            const end = Number(query.end);
            const start = Number(query.start);

            const data = await fetchMeasurementsPaginated({
                end,
                start,
                userId: user.id,
            });

            return Response.json({ data });
        }
    } else if (request.method === 'DELETE') {
        await deleteMeasurement({
            measurementId: String(query.id),
            userId: user.id,
        });

        return Response.json({ message: 'OK' }, { status: 200 });
    } else if (request.method === 'PATCH' || request.method === 'POST') {
        const { date, fatPercent, weight } = patchRequestSchema.parse(
            await request.json(),
        );

        await updateMeasurement({
            date,
            fatPercent,
            measurementId: query.id,
            userId: user.id,
            weight,
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
export { route as GET, route as DELETE, route as PATCH, route as POST };
