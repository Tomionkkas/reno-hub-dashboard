-- =====================================================================
-- ROLLBACK + PRE-CHANGE SNAPSHOT for Plan 2 (RenoScout funnel tracking)
-- Project: kralcmyhjvoiywcpntkg (RenoWorld)
-- Captured: 2026-06-09, before applying any migration.
--
-- All Plan 2 DB changes are ADDITIVE + IDEMPOTENT. Running the rollback
-- block below fully restores the exact prior state.
-- =====================================================================

-- ---------------------------------------------------------------------
-- SNAPSHOT: full contents of shared_schema.user_roles BEFORE the seed.
-- (This is the only pre-existing table Plan 2 writes to. Restore these
--  rows if anything is ever lost.)
-- ---------------------------------------------------------------------
-- id                                   | user_id                              | project_id                           | app_name     | role  | created_at
-- 0cfc1b90-cece-446e-8771-72458136321c | 21594af3-62ef-4454-ab9e-95de07205dcc | 3fe85d09-e179-41e7-81e1-7df72b294538 | renotimeline | owner | 2025-09-16 11:36:10.088206+00
-- 0c6085b3-ebd6-485b-8b37-95e9b0015895 | d97375cd-ad47-46fb-aca2-5e578dac0bc3 | 137e808b-f9c2-4a20-840e-9ba663befe86 | renotimeline | owner | 2025-12-02 17:20:24.363547+00
-- 19e99fe5-37ce-4c31-8df5-0f99096cfb8a | a9ed8c45-bbeb-4d7b-a902-881837c42250 | NULL                                 | renotimeline | admin | 2025-12-17 12:11:30.237273+00
--
-- Restorable INSERTs (only needed if a row above is ever deleted):
-- insert into shared_schema.user_roles (id, user_id, project_id, app_name, role, created_at) values
--   ('0cfc1b90-cece-446e-8771-72458136321c','21594af3-62ef-4454-ab9e-95de07205dcc','3fe85d09-e179-41e7-81e1-7df72b294538','renotimeline','owner','2025-09-16 11:36:10.088206+00'),
--   ('0c6085b3-ebd6-485b-8b37-95e9b0015895','d97375cd-ad47-46fb-aca2-5e578dac0bc3','137e808b-f9c2-4a20-840e-9ba663befe86','renotimeline','owner','2025-12-02 17:20:24.363547+00'),
--   ('19e99fe5-37ce-4c31-8df5-0f99096cfb8a','a9ed8c45-bbeb-4d7b-a902-881837c42250',null,'renotimeline','admin','2025-12-17 12:11:30.237273+00');

-- =====================================================================
-- ROLLBACK BLOCK — run all three to undo Plan 2 entirely.
-- =====================================================================

-- 1. Remove Dawid's seeded renohub admin role (Task 3). Leaves his
--    renotimeline:owner row untouched.
delete from shared_schema.user_roles
where user_id = '21594af3-62ef-4454-ab9e-95de07205dcc'
  and app_name = 'renohub';

-- 2. Drop the role-resolution RPC (Task 2).
drop function if exists public.get_my_renohub_role();

-- 3. Drop the funnel events table + its indexes (Task 1). CASCADE covers
--    the FK to auth.users and the indexes.
drop table if exists shared_schema.renoscout_funnel_events cascade;

-- Note: two extra hardening migrations were applied beyond the original plan:
--   * grant_service_role_funnel_events  — grants service_role table privileges
--     (a fresh table in shared_schema does not inherit them automatically).
--   * harden_get_my_renohub_role_anon   — revokes anon EXECUTE on the RPC to
--     clear the anon SECURITY DEFINER advisory (authenticated-only by design).
-- Both are fully reversed by the `drop function` / `drop table cascade` above
-- (dropping the object removes its grants), so no extra rollback steps needed.

-- Edge functions (renoscout-funnel-event, renoscout-funnel-stats) are not
-- DB objects; remove them from the dashboard or via:
--   supabase functions delete renoscout-funnel-event  --project-ref kralcmyhjvoiywcpntkg
--   supabase functions delete renoscout-funnel-stats  --project-ref kralcmyhjvoiywcpntkg
