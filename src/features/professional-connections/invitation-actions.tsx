import { Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import {
    acceptProfessionalInvitation,
    removeProfessionalRelationship,
} from '../../app/actions';

type RunAction = (
    action: () => Promise<{ error?: string; ok: boolean }>,
) => Promise<void>;

type InvitationActionsProps = Readonly<{
    incoming?: boolean;
    relationshipId: string;
    run: RunAction;
}>;

export const InvitationActions = ({
    incoming = false,
    relationshipId,
    run,
}: InvitationActionsProps) => {
    const { t } = useTranslation();
    const handleRemove = () => {
        void run(() => removeProfessionalRelationship({ relationshipId }));
    };
    const handleAccept = () => {
        void run(() => acceptProfessionalInvitation({ relationshipId }));
    };

    if (!incoming) {
        return (
            <Button onClick={handleRemove} variant="outline">
                {t('generic.actions.cancel')}
            </Button>
        );
    }

    return (
        <>
            <Button onClick={handleAccept}>
                {t('generic.actions.accept')}
            </Button>
            <Button onClick={handleRemove} variant="outline">
                {t('generic.actions.decline')}
            </Button>
        </>
    );
};
