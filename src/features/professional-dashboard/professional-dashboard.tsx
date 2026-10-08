'use client';

import { Container } from '@mantine/core';
import { useRouter } from 'next/navigation';
import {
    type ChangeEventHandler,
    type FormEventHandler,
    type ReactNode,
    useState,
} from 'react';

import { useLocalizedPath } from '~hooks/use-localized-path';
import { useMeals, useUnsavedChanges } from '~store/hooks';
import type {
    PaginatedProfessionalClients,
    ProfessionalClientSummary,
} from '~types/professional';

import { removeProfessionalRelationship } from '../../app/actions';
import { ClientDirectory } from './client-directory';
import { ClientDrawer } from './client-drawer';
import { UnsavedChangesModal } from './unsaved-changes-modal';
import { useNavigationGuard } from './use-navigation-guard';

type ProfessionalDashboardProps = Readonly<{
    clients: PaginatedProfessionalClients;
    detail: ReactNode;
    query: string;
    selectedClient: ProfessionalClientSummary | null;
}>;

export const ProfessionalDashboard = ({
    clients,
    detail,
    query,
    selectedClient,
}: ProfessionalDashboardProps) => {
    const router = useRouter();
    const localize = useLocalizedPath();
    const [search, setSearch] = useState(query);
    const [shouldStopAfterPrompt, setShouldStopAfterPrompt] = useState(false);
    const ownerUserId = selectedClient?.id ?? -1;
    const { hasUnsavedChanges, removeChanges } = useUnsavedChanges(ownerUserId);
    const { savePlan } = useMeals(ownerUserId);
    const { clearNavigation, isPromptOpen, pendingUrl, requestNavigation } =
        useNavigationGuard(hasUnsavedChanges);

    const destination = ({
        client,
        page = clients.page,
        q = query,
    }: {
        client?: number;
        page?: number;
        q?: string;
    }) => {
        const params = new URLSearchParams();
        if (q) {
            params.set('q', q);
        }
        if (page > 1) {
            params.set('page', String(page));
        }
        if (client) {
            params.set('client', String(client));
        }
        const value = params.toString();
        return `${localize('/professional')}${value ? `?${value}` : ''}`;
    };

    const navigate = (url: string) => {
        if (requestNavigation(url)) {
            return;
        }
        router.push(url);
    };

    const handleSearch: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        navigate(destination({ page: 1, q: search.trim() }));
    };

    const continueNavigation = async () => {
        const url = pendingUrl;
        if (shouldStopAfterPrompt && selectedClient) {
            const result = await removeProfessionalRelationship({
                relationshipId: selectedClient.relationshipId,
            });
            if (!result.ok) {
                return;
            }
        }
        clearNavigation();
        setShouldStopAfterPrompt(false);
        if (url) {
            router.push(url);
            router.refresh();
        }
    };

    const handleDiscardAndContinue = () => {
        removeChanges();
        void continueNavigation();
    };

    const handleCancelNavigation = () => {
        clearNavigation();
        setShouldStopAfterPrompt(false);
    };

    const handleSaveAndContinue = async () => {
        if (await savePlan()) {
            await continueNavigation();
        }
    };

    const handleStopManaging = async () => {
        if (!selectedClient) {
            return;
        }
        if (hasUnsavedChanges) {
            requestNavigation(destination({}));
            setShouldStopAfterPrompt(true);
            return;
        }
        const result = await removeProfessionalRelationship({
            relationshipId: selectedClient.relationshipId,
        });
        if (result.ok) {
            router.push(destination({}));
            router.refresh();
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        setSearch(event.target.value);
    };

    const handleSelectClient = (clientId: number) => {
        navigate(destination({ client: clientId }));
    };

    const handlePageChange = (page: number) => {
        navigate(destination({ page }));
    };

    const handleCloseDrawer = () => {
        navigate(destination({}));
    };

    return (
        <Container fluid>
            <ClientDirectory
                clients={clients}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                onSearchChange={handleSearchChange}
                onSelectClient={handleSelectClient}
                search={search}
                selectedClientId={selectedClient?.id}
            />
            <ClientDrawer
                client={selectedClient}
                detail={detail}
                onClose={handleCloseDrawer}
                onStopManaging={handleStopManaging}
            />
            <UnsavedChangesModal
                onCancel={handleCancelNavigation}
                onDiscard={handleDiscardAndContinue}
                onSave={handleSaveAndContinue}
                opened={isPromptOpen}
            />
        </Container>
    );
};
