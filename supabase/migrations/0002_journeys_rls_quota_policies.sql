-- RoverNote: quota enforcement via RLS policy intent
-- Note: you already have hard enforcement via an INSERT trigger (0001_*).
-- These policies reflect the intended access model at the RLS layer too.

alter table public.journeys enable row level security;

-- INSERT: only allow creating a new journey if quota allows (free < 3, premium unlimited).
drop policy if exists "journeys_insert_own_quota" on public.journeys;
create policy "journeys_insert_own_quota"
on public.journeys
for insert
to authenticated
with check (
  auth.uid() = user_id
  and public.can_create_journey(user_id)
);

-- UPDATE: allow owners to edit their existing journeys (quota should not block edits).
drop policy if exists "journeys_update_own" on public.journeys;
create policy "journeys_update_own"
on public.journeys
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- DELETE: allow owners to delete their journeys.
drop policy if exists "journeys_delete_own" on public.journeys;
create policy "journeys_delete_own"
on public.journeys
for delete
to authenticated
using (auth.uid() = user_id);

