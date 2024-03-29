create table if not exists
  public.meals_pool (
    id bigint generated by default as identity,
    content text not null,
    user_id bigint not null,
    constraint meals_pool_pkey primary key (id),
    constraint meals_pool_user_id_fkey foreign key (user_id) references users (id)
  ) tablespace pg_default;
