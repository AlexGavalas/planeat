create table if not exists
  public.notifications (
    id uuid not null default uuid_generate_v4 (),
    date date not null,
    notification_type text not null,
    request_user_id bigint not null,
    target_user_id bigint not null,
    constraint notifications_pkey primary key (id),
    constraint notifications_request_user_id_fkey foreign key (request_user_id) references users (id) on delete cascade,
    constraint notifications_target_user_id_fkey foreign key (target_user_id) references users (id) on delete cascade
  ) tablespace pg_default;
