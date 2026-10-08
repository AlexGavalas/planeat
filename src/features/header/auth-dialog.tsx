import { Button, Modal } from '@mantine/core';
import { LogIn } from 'iconoir-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    type MouseEventHandler,
    type SubmitEventHandler,
    useEffect,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { useLocalizedPath } from '~hooks/use-localized-path';

import { AUTH_DIALOG_EVENT, type AuthDialogMode } from './auth-dialog-event';
import { AuthForm } from './auth-form';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const registerSchema = loginSchema.extend({
    fullName: z.string(),
    professional: z.string().optional().transform(Boolean),
});

export const AuthDialog = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const localize = useLocalizedPath();
    const [isOpen, setIsOpen] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const closeModal = () => {
        setIsOpen(false);
        setIsRegistering(false);
        setError(null);
    };

    useEffect(() => {
        const handleOpen = (event: Event) => {
            const mode = (event as CustomEvent<AuthDialogMode>).detail;
            setIsRegistering(mode === 'register');
            setError(null);
            setIsOpen(true);
        };

        window.addEventListener(AUTH_DIALOG_EVENT, handleOpen);
        return () => {
            window.removeEventListener(AUTH_DIALOG_EVENT, handleOpen);
        };
    }, []);

    const handleLoginWithGoogle = (async () => {
        await signIn('google', { callbackUrl: localize('/') });
    }) satisfies MouseEventHandler<HTMLButtonElement>;

    const handleEmailSubmit = (async (event) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);
        const formData = Object.fromEntries(new FormData(event.currentTarget));

        try {
            if (isRegistering) {
                const {
                    email,
                    fullName,
                    password,
                    professional: isProfessional,
                } = registerSchema.parse(formData);
                const response = await fetch('/api/auth/register', {
                    body: JSON.stringify({
                        email,
                        fullName,
                        password,
                        professional: isProfessional,
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

            const { email, password } = loginSchema.parse(formData);
            const result = await signIn('credentials', {
                callbackUrl: localize('/'),
                email,
                password,
                redirect: false,
            });
            if (!result?.ok) {
                setError(t('login.errors.invalid_credentials'));
                return;
            }

            router.push(localize('/'));
            router.refresh();
            closeModal();
        } catch (caughtError) {
            console.log(caughtError);
            setError(t('login.errors.generic'));
        } finally {
            setIsSubmitting(false);
        }
    }) satisfies SubmitEventHandler<HTMLFormElement>;

    const toggleMode = () => {
        setIsRegistering((value) => !value);
        setError(null);
    };

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    return (
        <>
            <Button leftSection={<LogIn />} onClick={handleOpenModal}>
                {t('login.button')}
            </Button>
            <Modal
                centered
                onClose={closeModal}
                opened={isOpen}
                title={t(
                    isRegistering ? 'login.register_title' : 'login.title',
                )}
            >
                <AuthForm
                    error={error}
                    isRegistering={isRegistering}
                    isSubmitting={isSubmitting}
                    onGoogleLogin={handleLoginWithGoogle}
                    onSubmit={handleEmailSubmit}
                    onToggleMode={toggleMode}
                />
            </Modal>
        </>
    );
};
