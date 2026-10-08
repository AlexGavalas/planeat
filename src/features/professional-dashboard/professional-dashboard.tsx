'use client';

import {
    Badge,
    Button,
    Container,
    Drawer,
    Group,
    Modal,
    Pagination,
    Stack,
    Table,
    Text,
    TextInput,
    Title,
    UnstyledButton,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import {
    type ChangeEventHandler,
    type FormEventHandler,
    type ReactNode,
    useEffect,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '~components/card';
import { MAX_PROFESSIONAL_CLIENTS } from '~constants/professional';
import { useLocalizedPath } from '~hooks/use-localized-path';
import { useMeals, useUnsavedChanges } from '~store/hooks';
import type {
    PaginatedProfessionalClients,
    ProfessionalClientSummary,
} from '~types/professional';

import { removeProfessionalRelationship } from '../../app/actions';
import styles from './professional-dashboard.module.css';

type ProfessionalDashboardProps = Readonly<{
    clients: PaginatedProfessionalClients;
    detail: ReactNode;
    query: string;
    selectedClient: ProfessionalClientSummary | null;
}>;

type ClientListProps = Readonly<{
    clients: ProfessionalClientSummary[];
    onSelectClient: (clientId: number) => void;
    selectedClientId?: number;
}>;

const ClientList = ({
    clients,
    onSelectClient,
    selectedClientId,
}: ClientListProps) => {
    const { t } = useTranslation();

    if (!clients.length) {
        return <Text>{t('professional.dashboard.no_clients')}</Text>;
    }

    return (
        <Table highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>{t('professional.dashboard.client')}</Table.Th>
                    <Table.Th>{t('login.email')}</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {clients.map((client) => {
                    const handleClientClick = () => {
                        onSelectClient(client.id);
                    };

                    return (
                        <Table.Tr key={client.id}>
                            <Table.Td>
                                <UnstyledButton
                                    className={styles.rowButton}
                                    fw={
                                        selectedClientId === client.id
                                            ? 'var(--mantine-font-weight-bold)'
                                            : undefined
                                    }
                                    onClick={handleClientClick}
                                >
                                    {client.fullName}
                                </UnstyledButton>
                            </Table.Td>
                            <Table.Td>{client.email}</Table.Td>
                        </Table.Tr>
                    );
                })}
            </Table.Tbody>
        </Table>
    );
};

export const ProfessionalDashboard = ({
    clients,
    detail,
    query,
    selectedClient,
}: ProfessionalDashboardProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const localize = useLocalizedPath();
    const [search, setSearch] = useState(query);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [shouldStopAfterPrompt, setShouldStopAfterPrompt] = useState(false);
    const [isPromptOpen, setIsPromptOpen] = useState(false);
    const ownerUserId = selectedClient?.id ?? -1;
    const { hasUnsavedChanges, removeChanges } = useUnsavedChanges(ownerUserId);
    const { savePlan } = useMeals(ownerUserId);

    useEffect(() => {
        if (!hasUnsavedChanges) {
            return;
        }

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    useEffect(() => {
        if (!hasUnsavedChanges) {
            return;
        }

        const handleDocumentClick = (event: MouseEvent) => {
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

            const target = event.target;
            const anchor =
                target instanceof Element ? target.closest('a[href]') : null;
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
        return () => {
            document.removeEventListener('click', handleDocumentClick, true);
        };
    }, [hasUnsavedChanges]);

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
        if (hasUnsavedChanges) {
            setPendingUrl(url);
            setIsPromptOpen(true);
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
        setPendingUrl(null);
        setShouldStopAfterPrompt(false);
        setIsPromptOpen(false);
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
        setPendingUrl(null);
        setShouldStopAfterPrompt(false);
        setIsPromptOpen(false);
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
            setPendingUrl(destination({}));
            setShouldStopAfterPrompt(true);
            setIsPromptOpen(true);
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
            <Stack gap="lg">
                <Group justify="space-between">
                    <Title order={2}>{t('professional.dashboard.title')}</Title>
                    <Badge size="lg" variant="light">
                        {t('professional.dashboard.capacity', {
                            count: clients.total,
                            limit: MAX_PROFESSIONAL_CLIENTS,
                        })}
                    </Badge>
                </Group>
                <Card>
                    <Stack gap="md">
                        <form onSubmit={handleSearch}>
                            <Group align="end">
                                <TextInput
                                    flex={1}
                                    label={t(
                                        'professional.dashboard.search_label',
                                    )}
                                    onChange={handleSearchChange}
                                    placeholder={t(
                                        'professional.dashboard.search_placeholder',
                                    )}
                                    value={search}
                                />
                                <Button type="submit">
                                    {t('generic.search.label')}
                                </Button>
                            </Group>
                        </form>
                        <ClientList
                            clients={clients.clients}
                            onSelectClient={handleSelectClient}
                            selectedClientId={selectedClient?.id}
                        />
                        {clients.pageCount > 1 && (
                            <Pagination
                                onChange={handlePageChange}
                                total={clients.pageCount}
                                value={clients.page}
                            />
                        )}
                    </Stack>
                </Card>
            </Stack>
            <Drawer
                classNames={{ body: styles.drawerBody }}
                onClose={handleCloseDrawer}
                opened={Boolean(selectedClient)}
                position="right"
                size="min(100%, 76rem)"
                title={selectedClient?.fullName}
            >
                {selectedClient && (
                    <Stack gap="lg">
                        <Group justify="space-between">
                            <Text c="dimmed">{selectedClient.email}</Text>
                            <Button
                                color="danger"
                                onClick={handleStopManaging}
                                variant="outline"
                            >
                                {t('professional.dashboard.stop_managing')}
                            </Button>
                        </Group>
                        {detail}
                    </Stack>
                )}
            </Drawer>
            <Modal
                centered
                onClose={handleCancelNavigation}
                opened={isPromptOpen}
                size="lg"
                title={t('professional.unsaved.title')}
                zIndex={400}
            >
                <Stack>
                    <Text>{t('professional.unsaved.description')}</Text>
                    <Group className={styles.modalActions} justify="end">
                        <Button
                            onClick={handleCancelNavigation}
                            variant="default"
                        >
                            {t('generic.actions.cancel')}
                        </Button>
                        <Button
                            color="danger"
                            onClick={handleDiscardAndContinue}
                            variant="outline"
                        >
                            {t('professional.unsaved.discard')}
                        </Button>
                        <Button onClick={handleSaveAndContinue}>
                            {t('professional.unsaved.save')}
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
};
