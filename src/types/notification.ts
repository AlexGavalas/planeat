import { type Database } from './supabase';

export type Notification = Database['public']['Tables']['notifications']['Row'];

export type EditedNotification =
    Database['public']['Tables']['notifications']['Insert'];

export type NotificationsMap = Record<
    string,
    Notification | EditedNotification
>;
