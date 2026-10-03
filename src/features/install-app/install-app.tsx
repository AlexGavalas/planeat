'use client';

import { List, Menu, Modal, Stack, Text, UnstyledButton } from '@mantine/core';
import { CheckCircle, DownloadCircle } from 'iconoir-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './install-app.module.css';

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

type NavigatorWithStandalone = Navigator & {
    standalone?: boolean;
};

type InstallAppProps = Readonly<{
    placement?: 'landing' | 'menu';
}>;

const isIosDevice = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isRunningStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as NavigatorWithStandalone).standalone === true;

export const InstallApp = ({ placement = 'landing' }: InstallAppProps) => {
    const { t } = useTranslation();
    const [installPrompt, setInstallPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [isIosInstallOpen, setIsIosInstallOpen] = useState(false);
    const [canShowIosInstall, setCanShowIosInstall] = useState(false);

    useEffect(() => {
        if (!isRunningStandalone()) {
            setCanShowIosInstall(isIosDevice());
        }

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event as BeforeInstallPromptEvent);
        };
        const handleInstalled = () => {
            setInstallPrompt(null);
            setCanShowIosInstall(false);
            setIsIosInstallOpen(false);
        };

        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt,
        );
        window.addEventListener('appinstalled', handleInstalled);

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt,
            );
            window.removeEventListener('appinstalled', handleInstalled);
        };
    }, []);

    const handleInstall = useCallback(async () => {
        if (!installPrompt) {
            setIsIosInstallOpen(true);
            return;
        }

        await installPrompt.prompt();
        await installPrompt.userChoice;
        setInstallPrompt(null);
    }, [installPrompt]);
    const handleCloseIosInstall = useCallback(() => {
        setIsIosInstallOpen(false);
    }, []);

    if (!installPrompt && !canShowIosInstall) {
        return null;
    }

    const trigger =
        placement === 'menu' ? (
            <Menu.Item
                leftSection={<DownloadCircle aria-hidden />}
                onClick={handleInstall}
            >
                {t('install.action')}
            </Menu.Item>
        ) : (
            <UnstyledButton
                className={styles.landingTrigger}
                onClick={handleInstall}
            >
                <CheckCircle aria-hidden />
                <span>{t('install.available')}</span>
            </UnstyledButton>
        );

    return (
        <>
            {trigger}
            <Modal
                centered
                onClose={handleCloseIosInstall}
                opened={isIosInstallOpen}
                title={t('install.title')}
            >
                <Stack gap="md">
                    <Text>{t('install.description')}</Text>
                    <List withPadding type="ordered">
                        <List.Item>{t('install.ios.open_safari')}</List.Item>
                        <List.Item>{t('install.ios.tap_share')}</List.Item>
                        <List.Item>{t('install.ios.add')}</List.Item>
                    </List>
                </Stack>
            </Modal>
        </>
    );
};
