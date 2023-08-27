create table
  public.meals (
    id uuid not null default uuid_generate_v4 (),
    meal text not null,
    section_key text not null,
    day timestamp with time zone not null,
    user_id bigint not null,
    constraint meals_pkey primary key (id),
    constraint meals_user_id_fkey foreign key (user_id) references users (id) on delete cascade
  ) tablespace pg_default;
