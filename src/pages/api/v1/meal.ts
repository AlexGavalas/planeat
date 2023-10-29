import { createMeals, deleteMeals, fetchMeals, updateMeals } from '~api/meal';
import { patchRequestSchema } from '~schemas/meal';
import { type NextApiHandlerWithUser, withUser } from '~util/session';

const handler: NextApiHandlerWithUser = async ({
    req,
    res,
    supabase,
    user,
}) => {
    if (req.method === 'GET') {
        const endDate = String(req.query.endDate);
        const startDate = String(req.query.startDate);

        const { data } = await fetchMeals({
            endDate,
            startDate,
            supabase,
            userId: user.id,
        });

        res.json({ data });
    } else if (req.method === 'PATCH') {
        const { deletedIds, editedMeals, newMeals } = patchRequestSchema.parse(
            req.body,
        );

        const { error: deleteError } = await deleteMeals({
            deletedIds,
            supabase,
            userId: user.id,
        });

        const { error: updateError } = await updateMeals({
            editedMeals,
            supabase,
            userId: user.id,
        });

        const { error: createError } = await createMeals({
            newMeals,
            supabase,
            userId: user.id,
        });

        const error = deleteError ?? updateError ?? createError;

        if (error) {
            throw new Error(error.message, { cause: error });
        }

        res.status(200).json({ message: 'OK' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default withUser(handler);
