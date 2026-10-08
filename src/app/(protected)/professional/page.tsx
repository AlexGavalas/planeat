import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

import { fetchMeals } from '~api/meal';
import { fetchMealZoneTimes } from '~api/meal-zone';
import {
    fetchProfessionalClient,
    fetchProfessionalClients,
} from '~api/professional';
import { getRequestDate, requireUser } from '~api/session';
import { MealPlanPageSkeleton } from '~components/loading-skeleton';
import { MealZoneSettings } from '~features/meal-zone-settings';
import { ProfessionalDashboard } from '~features/professional-dashboard';
import { MealPlan } from '~features/screens/meal-plan';
import { createQueryClient } from '~util/query-client';

type ProfessionalPageProps = Readonly<{
    searchParams: Promise<{
        client?: string;
        page?: string;
        q?: string;
    }>;
}>;

async function ProfessionalDashboardContent({
    searchParams,
}: ProfessionalPageProps) {
    const user = await requireUser();
    if (!user.roles.includes('professional')) {
        redirect('/home');
    }

    const params = await searchParams;
    const page = Math.max(1, Number(params.page) || 1);
    const query = params.q?.trim() ?? '';
    const clientId = params.client ? Number(params.client) : null;
    const [clients, selectedClient] = await Promise.all([
        fetchProfessionalClients({
            page,
            professionalUserId: user.id,
            query,
        }),
        clientId
            ? fetchProfessionalClient({
                  clientUserId: clientId,
                  professionalUserId: user.id,
              })
            : null,
    ]);

    if (clientId && !selectedClient) {
        notFound();
    }

    let detail = null;

    if (selectedClient) {
        const now = getRequestDate();
        const startDate = format(
            startOfWeek(now, { weekStartsOn: 1 }),
            'yyyy-MM-dd',
        );
        const endDate = format(
            endOfWeek(now, { weekStartsOn: 1 }),
            'yyyy-MM-dd',
        );
        const [meals, mealZoneTimes] = await Promise.all([
            fetchMeals({
                endDate,
                startDate,
                userId: selectedClient.id,
            }),
            fetchMealZoneTimes({
                effectiveOn: startDate,
                userId: selectedClient.id,
            }),
        ]);
        const queryClient = createQueryClient();
        queryClient.setQueryData(
            ['meals', selectedClient.id, startDate],
            meals.data,
        );
        queryClient.setQueryData(
            ['meal-zone-times', selectedClient.id, startDate],
            { data: mealZoneTimes, effectiveFrom: startDate },
        );

        detail = (
            <HydrationBoundary state={dehydrate(queryClient)}>
                <MealPlan
                    canEditAnnotations={false}
                    initialDate={format(now, 'yyyy-MM-dd')}
                    ownerUserId={selectedClient.id}
                />
                <MealZoneSettings ownerUserId={selectedClient.id} />
            </HydrationBoundary>
        );
    }

    return (
        <ProfessionalDashboard
            clients={clients}
            detail={detail}
            query={query}
            selectedClient={selectedClient}
        />
    );
}

export default function Page({ searchParams }: ProfessionalPageProps) {
    return (
        <Suspense fallback={<MealPlanPageSkeleton />}>
            <ProfessionalDashboardContent searchParams={searchParams} />
        </Suspense>
    );
}
