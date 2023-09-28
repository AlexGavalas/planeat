import {
    ActionIcon,
    Autocomplete,
    type AutocompleteProps,
    Button,
    Group,
    Stack,
    Text,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { AddUser, Cancel, ProfileCircle } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { useProfile } from '~hooks/use-profile';
import { type User } from '~types/user';
import {
    showErrorNotification,
    showSuccessNotification,
} from '~util/notification';

export const FindUsers = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserFullname, setSelectedUserFullname] = useState('');
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 350);
    const { profile } = useProfile();
    const queryClient = useQueryClient();

    const { data: users = [] } = useQuery(
        ['users', debouncedSearchQuery],
        async () => {
            const response = await fetch(
                `/api/v1/user?type=search&fullName=${debouncedSearchQuery}`,
            );

            const { data } = await response.json();

            return (data as User[])?.map(({ full_name }) => full_name) ?? [];
        },
        {
            enabled: Boolean(debouncedSearchQuery),
        },
    );

    const { data: selectedUser, isFetching: isFetchingSelectedUser } = useQuery(
        ['connection', selectedUserFullname],
        async () => {
            const response = await fetch(
                `/api/v1/user?type=profile&fullName=${selectedUserFullname}`,
            );

            const { data } = await response.json();

            return data as User[];
        },
        {
            enabled: Boolean(selectedUserFullname),
        },
    );

    const selectedUserId = selectedUser?.[0].id;

    const {
        data: hasAlreadySentRequest,
        isFetching: isFetchingHasAlreadySentRequest,
    } = useQuery(
        ['connection_request', selectedUserId],
        async () => {
            if (!selectedUserId || !profile) {
                return null;
            }

            const response = await fetch(
                `/api/v1/notification?requestUserId=${profile.id}&targetUserId=${selectedUserId}`,
            );

            const { data } = await response.json();

            return data;
        },
        {
            enabled: Boolean(selectedUserId),
        },
    );

    const handleUserSelect: AutocompleteProps['onOptionSubmit'] = (value) => {
        setSelectedUserFullname(value);
    };

    const clearInput = () => {
        setSearchQuery('');
        setSelectedUserFullname('');
    };

    const handleConnectionRequest = async () => {
        if (!profile || !selectedUser) {
            return;
        }

        const response = await fetch('/api/v1/notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                targetUserId: selectedUser[0].id,
            }),
        });

        const { error } = await response.json();

        if (error) {
            showErrorNotification({
                title: t('error'),
                message: t('connections.request.error'),
            });
        } else {
            showSuccessNotification({
                title: t('success'),
                message: t('connections.request.success'),
            });

            await queryClient.invalidateQueries([
                'connection_request',
                selectedUserId,
            ]);
        }
    };

    const shouldShowConnectionInfo =
        selectedUser && !isFetchingHasAlreadySentRequest;

    return (
        <Stack gap="md">
            <Autocomplete
                data={users}
                disabled={isFetchingSelectedUser}
                leftSection={<ProfileCircle />}
                rightSection={
                    <ActionIcon onClick={clearInput} variant="subtle">
                        <Cancel />
                    </ActionIcon>
                }
                label={t('connections.search.label')}
                placeholder={t('connections.search.placeholder')}
                onChange={setSearchQuery}
                onOptionSubmit={handleUserSelect}
                value={searchQuery}
            />
            {shouldShowConnectionInfo &&
                (hasAlreadySentRequest ? (
                    <Text fw={600} c="green.8">
                        {t('connections.request.already_sent', {
                            fullName: selectedUser[0].full_name,
                        })}
                    </Text>
                ) : (
                    <Group justify="space-between">
                        <div>
                            <Text span>{t('connections.request.add')} </Text>
                            <Text fw={600} span>
                                {selectedUser[0].full_name}
                            </Text>
                            <Text span>
                                {' '}
                                {t('connections.request.to_connections')}?
                            </Text>
                        </div>
                        <Button
                            onClick={handleConnectionRequest}
                            rightSection={<AddUser />}
                            size="xs"
                        >
                            {t('connections.request.send')}
                        </Button>
                    </Group>
                ))}
        </Stack>
    );
};
