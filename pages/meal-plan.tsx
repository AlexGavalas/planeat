import {
    getUser,
    withAuthRequired,
} from '@supabase/supabase-auth-helpers/nextjs';

import { Calendar } from '@features/calendar';
import { Container } from '@mantine/core';

export const getServerSideProps = withAuthRequired({
    redirectTo: '/',
    getServerSideProps: async (context) => {
        const { user } = await getUser(context);

        return {
            props: {},
        };
    },
});

export default function MealPlan() {
    return (
        <Container size="xl" pt={20}>
            <Calendar />
        </Container>
    );
}
