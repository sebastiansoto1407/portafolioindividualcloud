-- Ejecutar una vez en el SQL Editor del proyecto portafoliocloud.
-- Los visitantes pueden enviar mensajes, pero no leerlos ni modificarlos.

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  sender_name text not null,
  sender_email text not null,
  body text not null,
  created_at timestamptz not null default now(),
  constraint contact_name_length check (char_length(btrim(sender_name)) between 2 and 80),
  constraint contact_email_length check (char_length(btrim(sender_email)) between 5 and 254),
  constraint contact_body_length check (char_length(btrim(body)) between 10 and 2000)
);

alter table public.contact_messages enable row level security;

drop policy if exists "Visitors can send contact messages" on public.contact_messages;
create policy "Visitors can send contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

revoke all on public.contact_messages from public, anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;
