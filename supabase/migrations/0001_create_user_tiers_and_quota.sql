-- RoverNote tiering + quota enforcement
-- Intended to be run via Supabase migrations / SQL editor.

-- 1) Table: user_tiers
create table if not exists public.user_tiers (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'premium')),
  premium_until timestamptz null,
  paddle_subscription_id text null,
  status text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_tiers_user_id_idx on public.user_tiers(user_id);

-- 2) RLS: allow users to read only their own tier row.
-- We assume you already have RLS enabled on `profiles`/`journeys`.
alter table public.user_tiers enable row level security;

-- Select self
drop policy if exists "user_tiers_select_own" on public.user_tiers;
create policy "user_tiers_select_own"
on public.user_tiers
for select
to authenticated
using (user_id = auth.uid());

-- No direct user writes: keep writes for server/webhook (service role).
drop policy if exists "user_tiers_insert_own" on public.user_tiers;
drop policy if exists "user_tiers_update_own" on public.user_tiers;
drop policy if exists "user_tiers_delete_own" on public.user_tiers;

-- 3) Helpers: is_premium + can_create_journey
create or replace function public.is_premium(p_user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_tiers ut
    where ut.user_id = p_user_id
      and ut.tier = 'premium'
      and (ut.premium_until is null or ut.premium_until > now())
  );
$$;

-- Free tier quota: max 3 journeys total per user
create or replace function public.can_create_journey(p_user_id uuid)
returns boolean
language sql
stable
as $$
  select
    case
      when public.is_premium(p_user_id) then true
      else (
        select count(*)
        from public.journeys j
        where j.user_id = p_user_id
      ) < 3
    end;
$$;

-- 4) Trigger: enforce quota at insert time (extra hard security, independent of existing RLS policies)
create or replace function public.enforce_free_journey_quota()
returns trigger
language plpgsql
as $$
begin
  -- If user doesn't have a tier row yet, treat as free.
  if not public.can_create_journey(new.user_id) then
    raise exception 'Free tier journey quota exceeded (max 3 journeys). Upgrade to Premium.';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_free_journey_quota_on_insert on public.journeys;
create trigger enforce_free_journey_quota_on_insert
before insert on public.journeys
for each row
execute function public.enforce_free_journey_quota();

-- 5) Ensure each new profile gets a free tier row.
create or replace function public.profiles_create_default_tier()
returns trigger
language plpgsql
as $$
begin
  insert into public.user_tiers (user_id, tier)
  values (new.id, 'free')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists profiles_create_default_tier_trigger on public.profiles;
create trigger profiles_create_default_tier_trigger
after insert on public.profiles
for each row
execute function public.profiles_create_default_tier();

-- 6) Webhook idempotency table (optional but recommended)
create table if not exists public.paddle_webhook_events (
  event_id text primary key,
  processed_at timestamptz not null default now()
);

