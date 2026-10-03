import { dispatchDueMealReminders } from '~api/meal-reminder';

export const runtime = 'nodejs';

export async function GET(request: Request): Promise<Response> {
    const secret = process.env.CRON_SECRET;

    if (
        !secret ||
        request.headers.get('authorization') !== `Bearer ${secret}`
    ) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const result = await dispatchDueMealReminders();
    return Response.json(result);
}
