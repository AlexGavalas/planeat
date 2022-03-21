import { Calendar } from '@features/calendar';
import { Container } from '@mantine/core';
import {
    getUser,
    withAuthRequired,
} from '@supabase/supabase-auth-helpers/nextjs';

export const getServerSideProps = withAuthRequired({
    redirectTo: '/',
    getServerSideProps: async (context) => {
        const { user } = await getUser(context).catch(() => ({ user: null }));

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
