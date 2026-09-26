import {
    Alert,
    Button,
    Divider,
    Modal,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { Google, LogIn } from 'iconoir-react';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next/pages';
import { useRouter } from 'next/router';
import {
    type FormEventHandler,
    type MouseEventHandler,
    useCallback,
    useState,
} from 'react';

import { UserMenu } from '~features/user-menu';

type UserActionsProps = Readonly<{
    hasUser: boolean;
}>;

export const UserActions = ({ hasUser }: UserActionsProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setIsRegistering(false);
        setError(null);
    }, []);

    const openModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleLoginWithGoogle = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        await signIn('google', { callbackUrl: '/home' });
    }, []);

    const handleEmailSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
        async (event) => {
            event.preventDefault();
            setError(null);
            setIsSubmitting(true);

            const formData = new FormData(event.currentTarget);
            const email = String(formData.get('email'));
            const password = String(formData.get('password'));

            try {
                if (isRegistering) {
                    const response = await fetch('/api/auth/register', {
                        body: JSON.stringify({
                            email,
                            fullName: String(formData.get('fullName')),
                            password,
                        }),
                        headers: { 'Content-Type': 'application/json' },
                        method: 'POST',
                    });

                    if (!response.ok) {
                        setError(
                            response.status === 409
                                ? t('login.errors.account_exists')
                                : t('login.errors.registration_failed'),
                        );
                        return;
                    }
                }

                const result = await signIn('credentials', {
                    callbackUrl: '/home',
                    email,
                    password,
                    redirect: false,
                });

                if (!result?.ok) {
                    setError(t('login.errors.invalid_credentials'));
                    return;
                }

                closeModal();
                await router.push(result.url ?? '/home');
            } catch {
                setError(t('login.errors.generic'));
            } finally {
                setIsSubmitting(false);
            }
        },
        [closeModal, isRegistering, router, t],
    );

    const toggleMode = useCallback(() => {
        setIsRegistering((value) => !value);
        setError(null);
    }, []);

    if (!hasUser) {
        return (
            <>
                <Button leftSection={<LogIn />} onClick={openModal}>
                    {t('login.button')}
                </Button>
                <Modal
                    centered
                    onClose={closeModal}
                    opened={isOpen}
                    title={t('login.title')}
                >
                    <Stack gap="md">
                        <Button
                            leftSection={<Google />}
                            onClick={handleLoginWithGoogle}
                            variant="outline"
                        >
                            {t('login.google')}
                        </Button>
                        <Divider label={t('login.or')} labelPosition="center" />
                        <form onSubmit={handleEmailSubmit}>
                            <Stack gap="sm">
                                {isRegistering && (
                                    <TextInput
                                        required
                                        aria-label={t('login.full_name')}
                                        autoComplete="name"
                                        label={t('login.full_name')}
                                        name="fullName"
                                    />
                                )}
                                <TextInput
                                    required
                                    aria-label={t('login.email')}
                                    autoComplete="email"
                                    label={t('login.email')}
                                    name="email"
                                    type="email"
                                />
                                <PasswordInput
                                    required
                                    aria-label={t('login.password')}
                                    autoComplete={
                                        isRegistering
                                            ? 'new-password'
                                            : 'current-password'
                                    }
                                    label={t('login.password')}
                                    minLength={8}
                                    name="password"
                                />
                                {error && (
                                    <Alert color="red" variant="outline">
                                        {error}
                                    </Alert>
                                )}
                                <Button loading={isSubmitting} type="submit">
                                    {t(
                                        isRegistering
                                            ? 'login.create_account'
                                            : 'login.email_submit',
                                    )}
                                </Button>
                            </Stack>
                        </form>
                        <Text size="sm" ta="center">
                            {t(
                                isRegistering
                                    ? 'login.has_account'
                                    : 'login.no_account',
                            )}{' '}
                            <Button
                                onClick={toggleMode}
                                size="compact-sm"
                                type="button"
                                variant="outline"
                            >
                                {t(
                                    isRegistering
                                        ? 'login.sign_in'
                                        : 'login.sign_up',
                                )}
                            </Button>
                        </Text>
                    </Stack>
                </Modal>
            </>
        );
    }

    return <UserMenu />;
};
