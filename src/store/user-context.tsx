import { type FC, type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useProfile } from '~hooks/use-profile';

export const UserContext: FC<{ children?: ReactNode }> = ({ children }) => {
    const { profile } = useProfile();
    const { i18n } = useTranslation();

    useEffect(() => {
        if (profile) {
            i18n?.changeLanguage(profile.language).catch(console.error);
        }
    }, [profile, i18n]);

    return children;
};
