import { i18n } from 'next-i18next';
import { type FC, type ReactNode, useEffect } from 'react';

import { useProfile } from '~hooks/use-profile';

export const UserContext: FC<{ children?: ReactNode }> = ({ children }) => {
    const { profile } = useProfile();

    useEffect(() => {
        if (profile) {
            i18n?.changeLanguage(profile.language).catch(console.error);
        }
    }, [profile]);

    return <>{children}</>;
};
