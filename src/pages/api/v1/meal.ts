import { createMeals, deleteMeals, fetchMeals, updateMeals } from '~api/meal';
import { patchRequestSchema } from '~schemas/meal';
import { type NextApiHandlerWithUser, withUser } from '~util/session';

const handler: NextApiHandlerWithUser = async ({ req, res, user }) => {
    if (req.method === 'GET') {
        const endDate = String(req.query.endDate);
        const startDate = String(req.query.startDate);

        const { data } = await fetchMeals({
            endDate,
            startDate,
            userId: user.id,
        });

        res.json({ data });
    } else if (req.method === 'PATCH') {
        const { deletedIds, editedMeals, newMeals } = patchRequestSchema.parse(
            req.body,
        );

        await deleteMeals({
            deletedIds,
            userId: user.id,
        });

        await updateMeals({
            editedMeals,
            userId: user.id,
        });

        await createMeals({
            newMeals,
            userId: user.id,
        });

        res.status(200).json({ message: 'OK' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default withUser(handler);
