-- 1. Tabellen für Vokabeln erstellen
create table if not exists public.languages (
                                                id uuid primary key default gen_random_uuid(),
    name text not null
    );

create table if not exists public.books (
                                            id uuid primary key default gen_random_uuid(),
    language_id uuid references public.languages on delete cascade,
    name text not null
    );

create table if not exists public.chapters (
                                               id uuid primary key default gen_random_uuid(),
    book_id uuid references public.books on delete cascade,
    name text not null
    );

create table if not exists public.vocabularies (
                                                   id uuid primary key default gen_random_uuid(),
    chapter_id uuid references public.chapters on delete cascade,
    latin text not null,
    german text not null
    );

-- 2. Tabelle für Benutzerprofile (Benutzername)
create table if not exists public.profiles (
                                               id uuid references auth.users on delete cascade primary key,
                                               username text unique,
                                               updated_at timestamp with time zone default timezone('utc'::text, now())
    );

-- 3. Tabellen für Fortschritt und Statistiken
create table if not exists public.user_progress (
                                                    user_id uuid references auth.users on delete cascade,
                                                    vocab_id uuid references public.vocabularies on delete cascade,
                                                    streak int default 0,
                                                    errors int default 0,
                                                    box int default 1,
                                                    updated_at timestamp with time zone default timezone('utc'::text, now()),
    primary key (user_id, vocab_id)
    );

create table if not exists public.user_stats (
                                                 user_id uuid references auth.users on delete cascade primary key,
                                                 xp int default 0,
                                                 level int default 1,
                                                 streak int default 0,
                                                 last_learning_date date
);

-- 4. Row Level Security (RLS) aktivieren
alter table public.languages enable row level security;
alter table public.books enable row level security;
alter table public.chapters enable row level security;
alter table public.vocabularies enable row level security;
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_stats enable row level security;

-- 5. Policies (Jeder darf Vokabeln lesen, aber nur eigene Daten ändern)
create policy "Allow public read languages" on public.languages for select using (true);
create policy "Allow public read books" on public.books for select using (true);
create policy "Allow public read chapters" on public.chapters for select using (true);
create policy "Allow public read vocabularies" on public.vocabularies for select using (true);

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for update using (auth.uid() = user_id);

create policy "Users can view own stats" on public.user_stats for select using (auth.uid() = user_id);
create policy "Users can insert own stats" on public.user_stats for insert with check (auth.uid() = user_id);
create policy "Users can update own stats" on public.user_stats for update using (auth.uid() = user_id);

-- 6. Beispiel-Daten (Lektion 56 & 57) einfügen
DO $$
DECLARE
lang_id uuid;
    book_id uuid;
    chap56_id uuid;
    chap57_id uuid;
BEGIN
    -- Sprache anlegen
INSERT INTO public.languages (name) VALUES ('Latin-German') RETURNING id INTO lang_id;
-- Buch anlegen
INSERT INTO public.books (language_id, name) VALUES (lang_id, 'Agite') RETURNING id INTO book_id;
-- Kapitel anlegen
INSERT INTO public.chapters (book_id, name) VALUES (book_id, 'Lektion 56') RETURNING id INTO chap56_id;
INSERT INTO public.chapters (book_id, name) VALUES (book_id, 'Lektion 57') RETURNING id INTO chap57_id;

-- Lektion 56 Vokabeln
INSERT INTO public.vocabularies (chapter_id, latin, german) VALUES
                                                                (chap56_id, 'nēmō nostrum', 'niemand von uns'),
                                                                (chap56_id, 'ars dicendī', 'die Rhetorik, Redekunst'),
                                                                (chap56_id, 'pār, paris', 'gleich, angemessen; ebenbürtig'),
                                                                (chap56_id, 'lectus, ī m.', 'das Bett, die Liege'),
                                                                (chap56_id, 'quiēscere, quiēscō', 'ruhen, schlafen'),
                                                                (chap56_id, 'somnium, ī n.', 'der Traum'),
                                                                (chap56_id, 'hinc (Adv.)', 'von da an, daraufhin'),
                                                                (chap56_id, 'improbus, a, um', 'böse, unverschämt'),
                                                                (chap56_id, 'inopia, ae f.', 'die Not, der Mangel'),
                                                                (chap56_id, 'tribūnus, ī m.', 'der Tribun');

-- Lektion 57 Vokabeln
INSERT INTO public.vocabularies (chapter_id, latin, german) VALUES
                                                                (chap57_id, 'maximē (Adv.)', 'besonders, am meisten'),
                                                                (chap57_id, 'libīdō, libīdinis f.', 'die Lust, Begierde'),
                                                                (chap57_id, 'accendere, accendō', 'anzünden, anfeuern, erregen'),
                                                                (chap57_id, 'potius (Adv.)', 'eher, lieber'),
                                                                (chap57_id, 'magis (Adv.)', 'mehr'),
                                                                (chap57_id, 'creāre, creō', 'erschaffen'),
                                                                (chap57_id, 'necessitās, necessitātis f.', 'die Not, Notwendigkeit'),
                                                                (chap57_id, 'cernere, cernō', 'wahrnehmen, bemerken'),
                                                                (chap57_id, 'error, errōris m.', 'der Irrtum; die Irrfahrt'),
                                                                (chap57_id, 'vel', 'oder');
END $$;

-- 7. Trigger: Profil automatisch bei Registrierung anlegen
create or replace function public.handle_new_user()
returns trigger as $$
begin
insert into public.profiles (id, username)
values (new.id, split_part(new.email, '@', 1));
insert into public.user_stats (user_id) values (new.id);
return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();