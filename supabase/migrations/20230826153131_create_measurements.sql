create table
  public.measurements (
    id uuid not null default uuid_generate_v4 (),
    user_id uuid not null,
    date date not null,
    weight double precision not null,
    fat_percentage double precision null,
    constraint measurements_pkey primary key (id),
    constraint measurements_user_id_fkey foreign key (user_id) references auth.users (id)
  ) tablespace pg_default;
