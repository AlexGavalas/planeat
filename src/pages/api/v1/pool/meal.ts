import { createMealInPool, fetchMealPool } from '~api/meal-pool';
import { postRequestSchema } from '~schemas/meal-pool';
import { type NextApiHandlerWithUser, withUser } from '~util/session';

const handler: NextApiHandlerWithUser = async ({
    req,
    res,
    supabase,
    user,
}) => {
    if (req.method === 'GET') {
        const { q } = req.query;

        const data = await fetchMealPool({
            q: String(q),
            supabase,
            userId: user.id,
        });

        res.json({
            data: data.map(({ content }) => content),
        });
    } else if (req.method === 'POST') {
        const { content } = postRequestSchema.parse(req.body);

        const { error } = await createMealInPool({
            content,
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
