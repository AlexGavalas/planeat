import { UserMenu } from '~features/user-menu';

import { AuthDialog } from './auth-dialog';

type UserActionsProps = Readonly<{
    hasUser: boolean;
    isProfessional?: boolean;
}>;

export const UserActions = ({
    hasUser,
    isProfessional = false,
}: UserActionsProps) => {
    if (!hasUser) {
        return <AuthDialog />;
    }

    return <UserMenu isProfessional={isProfessional} />;
};
