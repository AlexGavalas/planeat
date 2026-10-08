import { usePathname } from 'next/navigation';

export const useLocalizedPath = (): ((path: string) => string) => {
    const pathname = usePathname();

    const prefix = /^\/(en|gr)(?=\/|$)/.exec(pathname)?.[0] ?? '';

    return (path: string) => `${prefix}${path}`;
};
