export const AUTH_DIALOG_EVENT = 'planeat:open-auth-dialog';

export type AuthDialogMode = 'login' | 'register';

export const openAuthDialog = (mode: AuthDialogMode): void => {
    window.dispatchEvent(
        new CustomEvent<AuthDialogMode>(AUTH_DIALOG_EVENT, { detail: mode }),
    );
};
