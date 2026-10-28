-- Tabelle für Backup-Codes
create table if not exists public.mfa_backup_codes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users on delete cascade,
    code text not null,
    used boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Row Level Security aktivieren
alter table public.mfa_backup_codes enable row level security;

-- Policies: User dürfen nur ihre eigenen Codes sehen/ändern
create policy "Users can view own backup codes" on public.mfa_backup_codes for select using (auth.uid() = user_id);
create policy "Users can insert own backup codes" on public.mfa_backup_codes for insert with check (auth.uid() = user_id);
create policy "Users can update own backup codes" on public.mfa_backup_codes for update using (auth.uid() = user_id);
create policy "Users can delete own backup codes" on public.mfa_backup_codes for delete using (auth.uid() = user_id);