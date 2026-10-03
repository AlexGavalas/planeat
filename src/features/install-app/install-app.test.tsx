import { Menu } from '@mantine/core';

import { fireEvent, renderWithUser, screen } from '~test/utils';

import { InstallApp } from './install-app';

const renderInstallApp = () => renderWithUser(<InstallApp />);

describe('install app', () => {
    const originalUserAgent = navigator.userAgent;

    afterEach(() => {
        Object.defineProperty(navigator, 'userAgent', {
            configurable: true,
            value: originalUserAgent,
        });
    });

    it('shows the browser install prompt when installation is available', async () => {
        expect.assertions(2);
        const prompt = jest.fn().mockResolvedValue(undefined);
        const installEvent = Object.assign(new Event('beforeinstallprompt'), {
            prompt,
            userChoice: Promise.resolve({ outcome: 'accepted' as const }),
        });

        const { user } = renderInstallApp();
        fireEvent(window, installEvent);

        await user.click(
            await screen.findByRole('button', {
                name: 'Installable on your device',
            }),
        );

        expect(prompt).toHaveBeenCalledTimes(1);
        expect(
            screen.queryByRole('button', {
                name: 'Installable on your device',
            }),
        ).not.toBeInTheDocument();
    });

    it('shows manual installation steps on iOS', async () => {
        expect.assertions(1);
        Object.defineProperty(navigator, 'userAgent', {
            configurable: true,
            value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
        });

        const { user } = renderInstallApp();

        await user.click(
            await screen.findByRole('button', {
                name: 'Installable on your device',
            }),
        );

        const instruction = await screen.findByText('Tap the Share button.');

        expect(instruction).toBeInTheDocument();
    });

    it('stays hidden when installation is unavailable', () => {
        expect.assertions(1);
        renderInstallApp();

        expect(
            screen.queryByRole('button', {
                name: 'Installable on your device',
            }),
        ).not.toBeInTheDocument();
    });

    it('renders the installation action as a menu item', async () => {
        expect.assertions(1);
        const renderMenu = (opened: boolean) => (
            <Menu keepMounted keepMountedMode="display-none" opened={opened}>
                <Menu.Target>
                    <button type="button">Open menu</button>
                </Menu.Target>
                <Menu.Dropdown>
                    <InstallApp placement="menu" />
                </Menu.Dropdown>
            </Menu>
        );
        const { rerender } = renderWithUser(renderMenu(false));
        fireEvent(
            window,
            Object.assign(new Event('beforeinstallprompt'), {
                prompt: jest.fn().mockResolvedValue(undefined),
                userChoice: Promise.resolve({ outcome: 'accepted' as const }),
            }),
        );
        rerender(renderMenu(true));

        const menuItem = await screen.findByRole('menuitem', {
            name: 'Install app',
        });

        expect(menuItem).toBeInTheDocument();
    });
});
