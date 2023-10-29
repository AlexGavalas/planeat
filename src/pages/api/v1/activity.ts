import {
    deleteActivity,
    fetchActivitiesCount,
    fetchActivitiesPaginated,
    updateActivity,
} from '~api/activity';
import { patchRequestSchema } from '~schemas/activity';
import { type NextApiHandlerWithUser, withUser } from '~util/session';

const handler: NextApiHandlerWithUser = async ({
    req,
    res,
    supabase,
    user,
}) => {
    if (req.method === 'GET') {
        if (req.query.count === 'true') {
            const count = await fetchActivitiesCount({
                supabase,
                userId: user.id,
            });

            res.json({ count });
        } else {
            const end = Number(req.query.end);
            const start = Number(req.query.start);

            const data = await fetchActivitiesPaginated({
                end,
                start,
                supabase,
                userId: user.id,
            });

            res.json({ data });
        }
    } else if (req.method === 'DELETE') {
        const { error } = await deleteActivity({
            activityId: String(req.query.id),
            supabase,
            userId: user.id,
        });

        if (error) {
            throw new Error(error.message);
        }

        res.status(200).json({ message: 'OK' });
    } else if (req.method === 'PATCH' || req.method === 'POST') {
        const { activity, date } = patchRequestSchema.parse(req.body);

        const { error } = await updateActivity({
            activity,
            activityId: req.query.id ? String(req.query.id) : undefined,
            date,
            supabase,
            userId: user.id,
        });

        if (error) {
            throw new Error(error.message);
        }

        res.status(200).json({ message: 'OK' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default withUser(handler);
