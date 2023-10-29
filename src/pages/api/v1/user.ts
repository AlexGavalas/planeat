import {
    deleteProfile,
    fetchUserByFullname,
    findUsersByName,
    updateProfile,
} from '~api/user';
import { patchRequestSchema } from '~schemas/user';
import { type NextApiHandlerWithUser, withUser } from '~util/session';

const handler: NextApiHandlerWithUser = async ({
    req,
    res,
    user,
    supabase,
}) => {
    if (req.method === 'GET') {
        if (req.query.type === 'search') {
            const { data } = await findUsersByName({
                fullName: String(req.query.fullName),
                supabase,
                userId: user.id,
            });

            res.json({
                data: data?.map(({ full_name }) => full_name),
            });
        } else if (req.query.type === 'profile') {
            const { data } = await fetchUserByFullname({
                fullName: String(req.query.fullName),
                supabase,
            });

            res.json({ data });
        } else {
            res.json({ data: user });
        }
    } else if (req.method === 'PATCH') {
        const {
            height,
            isDiscoverable,
            language,
            targetWeight,
            hasCompletedOnboarding,
        } = patchRequestSchema.parse(req.body);

        const { error } = await updateProfile({
            hasCompletedOnboarding,
            height,
            isDiscoverable,
            language,
            supabase,
            targetWeight,
            userId: user.id,
        });

        if (error) {
            throw new Error(error.message);
        }

        res.status(200).json({ message: 'OK' });
    } else if (req.method === 'DELETE') {
        const { error } = await deleteProfile({
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
