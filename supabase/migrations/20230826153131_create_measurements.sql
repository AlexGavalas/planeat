create table
  public.measurements (
    id uuid not null default uuid_generate_v4 (),
    date date not null,
    weight double precision not null,
    fat_percentage double precision null,
    user_id bigint not null,
    constraint measurements_pkey primary key (id),
    constraint measurements_user_id_fkey foreign key (user_id) references users (id) on delete cascade
  ) tablespace pg_default;
