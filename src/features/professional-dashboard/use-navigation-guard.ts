import { useEffect, useState } from 'react';

type NavigationGuard = {
    clearNavigation: () => void;
    isPromptOpen: boolean;
    pendingUrl: string | null;
    requestNavigation: (url: string) => boolean;
};

export const useNavigationGuard = (
    hasUnsavedChanges: boolean,
): NavigationGuard => {
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [isPromptOpen, setIsPromptOpen] = useState(false);

    const requestNavigation = (url: string): boolean => {
        if (!hasUnsavedChanges) {
            return false;
        }
        setPendingUrl(url);
        setIsPromptOpen(true);
        return true;
    };

    const clearNavigation = (): void => {
        setPendingUrl(null);
        setIsPromptOpen(false);
    };

    useEffect(() => {
        if (!hasUnsavedChanges) {
            return;
        }
        const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
            event.preventDefault();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return (): void => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    useEffect(() => {
        if (!hasUnsavedChanges) {
            return;
        }
        const handleDocumentClick = (event: MouseEvent): void => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const anchor =
                event.target instanceof Element
                    ? event.target.closest('a[href]')
                    : null;
            if (!(anchor instanceof HTMLAnchorElement)) {
                return;
            }

            const url = new URL(anchor.href);
            if (url.origin !== window.location.origin) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            setPendingUrl(`${url.pathname}${url.search}${url.hash}`);
            setIsPromptOpen(true);
        };

        document.addEventListener('click', handleDocumentClick, true);
        return (): void => {
            document.removeEventListener('click', handleDocumentClick, true);
        };
    }, [hasUnsavedChanges]);

    return {
        clearNavigation,
        isPromptOpen,
        pendingUrl,
        requestNavigation,
    };
};
