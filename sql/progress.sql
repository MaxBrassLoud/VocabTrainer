-- Tabelle für Fortschritt
create table progress (
                          user_id uuid references auth.users on delete cascade primary key,
                          data jsonb not null default '{}'::jsonb,
                          updated_at timestamptz default now()
);

-- Row Level Security aktivieren (WICHTIG!)
alter table progress enable row level security;

-- Policy: Nutzer dürfen nur ihre eigenen Daten sehen
create policy "Users view own progress" on progress
  for select using (auth.uid() = user_id);

-- Policy: Nutzer dürfen nur ihre eigenen Daten einfügen
create policy "Users insert own progress" on progress
  for insert with check (auth.uid() = user_id);

-- Policy: Nutzer dürfen nur ihre eigenen Daten aktualisieren
create policy "Users update own progress" on progress
  for update using (auth.uid() = user_id);

-- Policy: Nutzer dürfen nur ihre eigenen Daten löschen
create policy "Users delete own progress" on progress
  for delete using (auth.uid() = user_id);