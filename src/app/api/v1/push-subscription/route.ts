import {
    deletePushSubscription,
    savePushSubscription,
} from '~api/push-notification';
import {
    deletePushSubscriptionSchema,
    pushSubscriptionSchema,
} from '~schemas/push-notification';
import { withUser } from '~util/session';

export const POST = withUser(async ({ request, user }) => {
    const subscription = pushSubscriptionSchema.parse(await request.json());
    await savePushSubscription({ subscription, userId: user.id });
    return Response.json({ message: 'OK' });
});

export const DELETE = withUser(async ({ request, user }) => {
    const { endpoint } = deletePushSubscriptionSchema.parse(
        await request.json(),
    );
    await deletePushSubscription({ endpoint, userId: user.id });
    return Response.json({ message: 'OK' });
});
