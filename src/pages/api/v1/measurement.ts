import {
    deleteMeasurement,
    fetchFatMeasurements,
    fetchLatestFatMeasurement,
    fetchLatestWeightMeasurement,
    fetchMeasurements,
    fetchMeasurementsCount,
    fetchMeasurementsPaginated,
    updateMeasurement,
} from '~api/measurement';
import { patchRequestSchema } from '~schemas/measurement';
import { type NextApiHandlerWithUser, withUser } from '~util/session';

const handler: NextApiHandlerWithUser = async ({ req, res, user }) => {
    if (req.method === 'GET') {
        if (req.query.type === 'latest-weight') {
            const { data } = await fetchLatestWeightMeasurement({
                userId: user.id,
            });
            res.json({ data: data[0]?.weight ?? 0 });
        } else if (req.query.type === 'latest-fat') {
            const { data } = await fetchLatestFatMeasurement({
                userId: user.id,
            });
            res.json({ data: data[0]?.fat_percentage ?? 0 });
        } else if (req.query.type === 'weight-timeline') {
            const { data } = await fetchMeasurements({ userId: user.id });
            res.json({ data });
        } else if (req.query.type === 'fat-timeline') {
            const { data } = await fetchFatMeasurements({ userId: user.id });
            res.json({ data });
        } else if (req.query.count === 'true') {
            const count = await fetchMeasurementsCount({
                userId: user.id,
            });

            res.json({ count });
        } else {
            const end = Number(req.query.end);
            const start = Number(req.query.start);

            const data = await fetchMeasurementsPaginated({
                end,
                start,
                userId: user.id,
            });

            res.json({ data });
        }
    } else if (req.method === 'DELETE') {
        await deleteMeasurement({
            measurementId: String(req.query.id),
            userId: user.id,
        });

        res.status(200).json({ message: 'OK' });
    } else if (req.method === 'PATCH' || req.method === 'POST') {
        const { date, fatPercent, weight } = patchRequestSchema.parse(req.body);

        await updateMeasurement({
            date,
            fatPercent,
            measurementId: req.query.id ? String(req.query.id) : undefined,
            userId: user.id,
            weight,
        });

        res.status(200).json({ message: 'OK' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default withUser(handler);
