import { Container } from '@mantine/core';
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs';

import { Calendar } from '@features/calendar';

export const getServerSideProps = withAuthRequired({
    redirectTo: '/',
});

const MealPlan = () => {
    return (
        <Container size="xl" p={20}>
            <Calendar />
        </Container>
    );
};

export default MealPlan;
