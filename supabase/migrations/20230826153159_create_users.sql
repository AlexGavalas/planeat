create table
  public.users (
    id uuid not null,
    created_at timestamp with time zone not null default now(),
    is_nutritionist boolean not null default false,
    full_name text not null,
    language text not null default 'en'::text,
    height double precision null,
    constraint users_pkey primary key (id),
    constraint users_id_fkey foreign key (id) references auth.users (id)
  ) tablespace pg_default;
