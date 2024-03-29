export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            activities: {
                Row: {
                    activity: string;
                    date: string;
                    id: string;
                    user_id: number;
                };
                Insert: {
                    activity: string;
                    date: string;
                    id?: string;
                    user_id: number;
                };
                Update: {
                    activity?: string;
                    date?: string;
                    id?: string;
                    user_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'activities_user_id_fkey';
                        columns: ['user_id'];
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            connections: {
                Row: {
                    connection_user_id: number;
                    id: string;
                    user_id: number;
                };
                Insert: {
                    connection_user_id: number;
                    id?: string;
                    user_id: number;
                };
                Update: {
                    connection_user_id?: number;
                    id?: string;
                    user_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'connections_connection_user_id_fkey';
                        columns: ['connection_user_id'];
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'connections_user_id_fkey';
                        columns: ['user_id'];
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            meals: {
                Row: {
                    day: string;
                    id: string;
                    meal: string;
                    note: string | null;
                    rating: number | null;
                    section_key: string;
                    user_id: number;
                };
                Insert: {
                    day: string;
                    id?: string;
                    meal: string;
                    note?: string | null;
                    rating?: number | null;
                    section_key: string;
                    user_id: number;
                };
                Update: {
                    day?: string;
                    id?: string;
                    meal?: string;
                    note?: string | null;
                    rating?: number | null;
                    section_key?: string;
                    user_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'meals_user_id_fkey';
                        columns: ['user_id'];
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            meals_pool: {
                Row: {
                    content: string;
                    id: number;
                    user_id: number;
                };
                Insert: {
                    content: string;
                    id?: number;
                    user_id: number;
                };
                Update: {
                    content?: string;
                    id?: number;
                    user_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'meals_pool_user_id_fkey';
                        columns: ['user_id'];
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            measurements: {
                Row: {
                    date: string;
                    fat_percentage: number | null;
                    id: string;
                    user_id: number;
                    weight: number;
                };
                Insert: {
                    date: string;
                    fat_percentage?: number | null;
                    id?: string;
                    user_id: number;
                    weight: number;
                };
                Update: {
                    date?: string;
                    fat_percentage?: number | null;
                    id?: string;
                    user_id?: number;
                    weight?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'measurements_user_id_fkey';
                        columns: ['user_id'];
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            notifications: {
                Row: {
                    date: string;
                    id: string;
                    notification_type: string;
                    request_user_id: number;
                    target_user_id: number;
                };
                Insert: {
                    date: string;
                    id?: string;
                    notification_type: string;
                    request_user_id: number;
                    target_user_id: number;
                };
                Update: {
                    date?: string;
                    id?: string;
                    notification_type?: string;
                    request_user_id?: number;
                    target_user_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: 'notifications_request_user_id_fkey';
                        columns: ['request_user_id'];
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'notifications_target_user_id_fkey';
                        columns: ['target_user_id'];
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            users: {
                Row: {
                    created_at: string;
                    email: string;
                    food_preferences_negative: string | null;
                    food_preferences_positive: string | null;
                    full_name: string;
                    has_completed_onboarding: boolean | null;
                    height: number | null;
                    id: number;
                    is_discoverable: boolean;
                    language: string;
                    target_weight: number | null;
                };
                Insert: {
                    created_at?: string;
                    email: string;
                    food_preferences_negative?: string | null;
                    food_preferences_positive?: string | null;
                    full_name: string;
                    has_completed_onboarding?: boolean | null;
                    height?: number | null;
                    id?: number;
                    is_discoverable?: boolean;
                    language: string;
                    target_weight?: number | null;
                };
                Update: {
                    created_at?: string;
                    email?: string;
                    food_preferences_negative?: string | null;
                    food_preferences_positive?: string | null;
                    full_name?: string;
                    has_completed_onboarding?: boolean | null;
                    height?: number | null;
                    id?: number;
                    is_discoverable?: boolean;
                    language?: string;
                    target_weight?: number | null;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
    storage: {
        Tables: {
            buckets: {
                Row: {
                    allowed_mime_types: string[] | null;
                    avif_autodetection: boolean | null;
                    created_at: string | null;
                    file_size_limit: number | null;
                    id: string;
                    name: string;
                    owner: string | null;
                    public: boolean | null;
                    updated_at: string | null;
                };
                Insert: {
                    allowed_mime_types?: string[] | null;
                    avif_autodetection?: boolean | null;
                    created_at?: string | null;
                    file_size_limit?: number | null;
                    id: string;
                    name: string;
                    owner?: string | null;
                    public?: boolean | null;
                    updated_at?: string | null;
                };
                Update: {
                    allowed_mime_types?: string[] | null;
                    avif_autodetection?: boolean | null;
                    created_at?: string | null;
                    file_size_limit?: number | null;
                    id?: string;
                    name?: string;
                    owner?: string | null;
                    public?: boolean | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'buckets_owner_fkey';
                        columns: ['owner'];
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            migrations: {
                Row: {
                    executed_at: string | null;
                    hash: string;
                    id: number;
                    name: string;
                };
                Insert: {
                    executed_at?: string | null;
                    hash: string;
                    id: number;
                    name: string;
                };
                Update: {
                    executed_at?: string | null;
                    hash?: string;
                    id?: number;
                    name?: string;
                };
                Relationships: [];
            };
            objects: {
                Row: {
                    bucket_id: string | null;
                    created_at: string | null;
                    id: string;
                    last_accessed_at: string | null;
                    metadata: Json | null;
                    name: string | null;
                    owner: string | null;
                    path_tokens: string[] | null;
                    updated_at: string | null;
                    version: string | null;
                };
                Insert: {
                    bucket_id?: string | null;
                    created_at?: string | null;
                    id?: string;
                    last_accessed_at?: string | null;
                    metadata?: Json | null;
                    name?: string | null;
                    owner?: string | null;
                    path_tokens?: string[] | null;
                    updated_at?: string | null;
                    version?: string | null;
                };
                Update: {
                    bucket_id?: string | null;
                    created_at?: string | null;
                    id?: string;
                    last_accessed_at?: string | null;
                    metadata?: Json | null;
                    name?: string | null;
                    owner?: string | null;
                    path_tokens?: string[] | null;
                    updated_at?: string | null;
                    version?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'objects_bucketId_fkey';
                        columns: ['bucket_id'];
                        referencedRelation: 'buckets';
                        referencedColumns: ['id'];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            can_insert_object: {
                Args: {
                    bucketid: string;
                    name: string;
                    owner: string;
                    metadata: Json;
                };
                Returns: undefined;
            };
            extension: {
                Args: {
                    name: string;
                };
                Returns: string;
            };
            filename: {
                Args: {
                    name: string;
                };
                Returns: string;
            };
            foldername: {
                Args: {
                    name: string;
                };
                Returns: unknown;
            };
            get_size_by_bucket: {
                Args: Record<PropertyKey, never>;
                Returns: {
                    size: number;
                    bucket_id: string;
                }[];
            };
            search: {
                Args: {
                    prefix: string;
                    bucketname: string;
                    limits?: number;
                    levels?: number;
                    offsets?: number;
                    search?: string;
                    sortcolumn?: string;
                    sortorder?: string;
                };
                Returns: {
                    name: string;
                    id: string;
                    updated_at: string;
                    created_at: string;
                    last_accessed_at: string;
                    metadata: Json;
                }[];
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
