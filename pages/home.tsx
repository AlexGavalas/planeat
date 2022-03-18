import {
    getUser,
    withAuthRequired,
    User,
} from '@supabase/supabase-auth-helpers/nextjs';

import Link from 'next/link';
import { Button, Center, Container, Group, Text } from '@mantine/core';

/*
{
    "id": "0db33dba-e235-49a8-9e21-d51681e5333c",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "alex.gavalas.92@gmail.com",
    "email_confirmed_at": null,
    "phone": "",
    "confirmed_at": null,
    "last_sign_in_at": null,
    "app_metadata": {
        "provider": "google",
        "providers": [
            "google"
        ]
    },
    "user_metadata": {
        "avatar_url": "https://lh3.googleusercontent.com/a-/AOh14GifWAOPiFBZngjgKJFb0VaSwyo3CtbHpGu2D9myiA=s96-c",
        "email": "alex.gavalas.92@gmail.com",
        "email_verified": true,
        "full_name": "Alex Gavalas",
        "iss": "https://www.googleapis.com/userinfo/v2/me",
        "name": "Alex Gavalas",
        "picture": "https://lh3.googleusercontent.com/a-/AOh14GifWAOPiFBZngjgKJFb0VaSwyo3CtbHpGu2D9myiA=s96-c",
        "provider_id": "102990282094564736022",
        "sub": "102990282094564736022"
    },
    "identities": [],
    "created_at": null,
    "updated_at": null,
    "supabase-auth-helpers-note": "This user payload is retrieved from the cached JWT and might be stale. If you need up to date user data, please call the `getUser` method in a server-side context!",
    "exp": 1647609798,
    "sub": "0db33dba-e235-49a8-9e21-d51681e5333c"
}
*/

export const getServerSideProps = withAuthRequired({
    redirectTo: '/',
    getServerSideProps: async (context) => {
        const { user } = await getUser(context);

        if (!user) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
                props: {},
            };
        }

        return {
            props: {
                user,
            },
        };
    },
});

const Home = ({ user }: { user: User }) => {
    return (
        <div className="home-container">
            <Center>
                <Container>
                    <Group direction="column">
                        <Text size="lg">
                            Welcome{' '}
                            <span style={{ fontWeight: 'bold' }}>
                                {user.user_metadata.name}
                            </span>
                        </Text>
                    </Group>
                    <Group>
                        <Link href="/meal-plan" passHref>
                            <Button component="a">View meal plan</Button>
                        </Link>
                    </Group>
                </Container>
            </Center>
        </div>
    );
};

export default Home;
