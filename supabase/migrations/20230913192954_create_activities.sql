create table if not exists
  public.activities (
    id uuid not null default uuid_generate_v4 (),
    date date not null,
    activity text not null,
    user_id bigint not null,
    constraint activities_pkey primary key (id),
    constraint activities_user_id_fkey foreign key (user_id) references users (id) on delete cascade
  ) tablespace pg_default;
