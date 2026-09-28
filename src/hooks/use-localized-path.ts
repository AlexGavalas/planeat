import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

export const useLocalizedPath = (): ((path: string) => string) => {
    const pathname = usePathname();

    const prefix = /^\/(en|gr)(?=\/|$)/.exec(pathname)?.[0] ?? '';

    return useCallback((path: string) => `${prefix}${path}`, [prefix]);
};
