import {
    deleteProfile,
    fetchUserByFullname,
    findUsersByName,
    updateFoodPreferences,
    updateProfile,
} from '~api/user';
import { patchRequestSchema } from '~schemas/user';
import { type NextApiHandlerWithUser, withUser } from '~util/session';

const handler: NextApiHandlerWithUser = async ({ req, res, user }) => {
    if (req.method === 'GET') {
        if (req.query.type === 'search') {
            const { data } = await findUsersByName({
                fullName: String(req.query.fullName),
                userId: user.id,
            });

            res.json({
                data: data.map(({ full_name }) => full_name),
            });
        } else if (req.query.type === 'profile') {
            const { data } = await fetchUserByFullname({
                fullName: String(req.query.fullName),
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
            foodPreferencesNegative,
            foodPreferencesPositive,
        } = patchRequestSchema.parse(req.body);

        await updateProfile({
            hasCompletedOnboarding,
            height,
            isDiscoverable,
            language,
            targetWeight,
            userId: user.id,
        });

        if (
            foodPreferencesNegative !== undefined ||
            foodPreferencesPositive !== undefined
        ) {
            await updateFoodPreferences({
                negative: foodPreferencesNegative ?? null,
                positive: foodPreferencesPositive ?? null,
                userId: user.id,
            });
        }

        res.status(200).json({ message: 'OK' });
    } else if (req.method === 'DELETE') {
        await deleteProfile({
            userId: user.id,
        });

        res.status(200).json({ message: 'OK' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default withUser(handler);
