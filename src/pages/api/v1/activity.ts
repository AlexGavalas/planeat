import {
    deleteActivity,
    fetchActivities,
    fetchActivitiesCount,
    fetchActivitiesPaginated,
    updateActivity,
} from '~api/activity';
import { patchRequestSchema } from '~schemas/activity';
import { type NextApiHandlerWithUser, withUser } from '~util/session';

const handler: NextApiHandlerWithUser = async ({ req, res, user }) => {
    if (req.method === 'GET') {
        if (req.query.startDate && req.query.endDate) {
            const data = await fetchActivities({
                endDate: String(req.query.endDate),
                startDate: String(req.query.startDate),
                userId: user.id,
            });

            res.json({ data });
        } else if (req.query.count === 'true') {
            const count = await fetchActivitiesCount({
                userId: user.id,
            });

            res.json({ count });
        } else {
            const end = Number(req.query.end);
            const start = Number(req.query.start);

            const data = await fetchActivitiesPaginated({
                end,
                start,
                userId: user.id,
            });

            res.json({ data });
        }
    } else if (req.method === 'DELETE') {
        await deleteActivity({
            activityId: String(req.query.id),
            userId: user.id,
        });

        res.status(200).json({ message: 'OK' });
    } else if (req.method === 'PATCH' || req.method === 'POST') {
        const { activity, date } = patchRequestSchema.parse(req.body);

        await updateActivity({
            activity,
            activityId: req.query.id ? String(req.query.id) : undefined,
            date,
            userId: user.id,
        });

        res.status(200).json({ message: 'OK' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default withUser(handler);
