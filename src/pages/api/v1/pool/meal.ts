import { createMealInPool, fetchMealPool } from '~api/meal-pool';
import { postRequestSchema } from '~schemas/meal-pool';
import { type NextApiHandlerWithUser, withUser } from '~util/session';

const handler: NextApiHandlerWithUser = async ({ req, res, user }) => {
    if (req.method === 'GET') {
        const { q } = req.query;

        const data = await fetchMealPool({
            q: String(q),
            userId: user.id,
        });

        res.json({
            data: data.map(({ content }) => content),
        });
    } else if (req.method === 'POST') {
        const { content } = postRequestSchema.parse(req.body);

        await createMealInPool({
            content,
            userId: user.id,
        });

        res.status(200).json({ message: 'OK' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default withUser(handler);
