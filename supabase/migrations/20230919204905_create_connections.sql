create table if not exists
  public.connections (
    id uuid not null default uuid_generate_v4 (),
    user_id bigint not null,
    connection_user_id bigint not null,
    constraint connections_pkey primary key (id),
    constraint connections_user_id_fkey foreign key (user_id) references users (id) on delete cascade,
    constraint connections_connection_user_id_fkey foreign key (connection_user_id) references users (id) on delete cascade
  ) tablespace pg_default;
