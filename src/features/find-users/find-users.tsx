import {
    ActionIcon,
    Autocomplete,
    type AutocompleteProps,
    Button,
    Group,
    Text,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { AddUser, Cancel, ProfileCircle } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useQuery } from 'react-query';

import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';
import { getUTCDate } from '~util/date';

const MAX_QUERY_RESULTS = 5;

export const FindUsers = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserFullname, setSelectedUserFullname] = useState('');
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 350);
    const { profile } = useProfile();
    const supabase = useSupabaseClient<Database>();

    const { data: users = [], isFetching } = useQuery(
        ['users', debouncedSearchQuery],
        async () => {
            const { data } = await supabase
                .from('users')
                .select('full_name')
                .ilike('full_name', `%${debouncedSearchQuery}%`)
                .eq('is_discoverable', true)
                .neq('email', profile?.email)
                .limit(MAX_QUERY_RESULTS);

            return data?.map(({ full_name }) => full_name) ?? [];
        },
        {
            enabled: Boolean(debouncedSearchQuery),
        },
    );

    const { data: selectedUser, isFetching: isFetchingSelectedUser } = useQuery(
        ['connection', selectedUserFullname],
        async () => {
            const { data } = await supabase
                .from('users')
                .select('id, full_name')
                .eq('full_name', selectedUserFullname);

            return data;
        },
        {
            enabled: Boolean(selectedUserFullname),
        },
    );

    const nothingFoundLabel =
        debouncedSearchQuery && !isFetching && !users?.length
            ? t('no_data')
            : '';

    const handleUserSelect: AutocompleteProps['onItemSubmit'] = ({ value }) => {
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

        const { error } = await supabase.from('notifications').insert({
            date: getUTCDate(new Date()).toUTCString(),
            notification_type: 'connection_request',
            request_user_id: profile.id,
            target_user_id: selectedUser[0].id,
        });

        if (error) {
            showNotification({
                title: t('error'),
                message: t('connections.request.error'),
                color: 'red',
            });
        } else {
            showNotification({
                title: t('success'),
                message: t('connections.request.success'),
            });
        }
    };

    return (
        <>
            <Autocomplete
                data={users}
                disabled={isFetchingSelectedUser}
                icon={<ProfileCircle />}
                rightSection={
                    <ActionIcon onClick={clearInput}>
                        <Cancel />
                    </ActionIcon>
                }
                label={t('connections.search.label')}
                nothingFound={nothingFoundLabel}
                placeholder={t('connections.search.placeholder')}
                onChange={setSearchQuery}
                onItemSubmit={handleUserSelect}
                withinPortal
                value={searchQuery}
            />
            {selectedUser && (
                <Group position="apart">
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
                        rightIcon={<AddUser />}
                        size="xs"
                    >
                        {t('connections.request.send')}
                    </Button>
                </Group>
            )}
        </>
    );
};
