-- ─── paginas_casal — complete table schema ────────────────────────────────────
-- Run this in Supabase SQL Editor (Dashboard > SQL > New Query)
--
-- Changes from original MVP:
--   + fotos        jsonb  — array of public image URLs (gallery)
--   + momentos     jsonb  — array of timeline moments (see type Momento)
--   + titulo       text   — optional tagline displayed under the names
--   + foto_capa    text   — hero cover photo URL
--
-- ──────────────────────────────────────────────────────────────────────────────

create table if not exists paginas_casal (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  nome_pessoa1    text not null,
  nome_pessoa2    text not null,
  contador_data   timestamptz not null,
  mensagem        text,
  titulo          text,                     -- tagline / subtitle
  tema            text not null default 'rosa'
                    check (tema in ('rosa', 'azul', 'dourado', 'escuro')),
  link_musica     text,
  foto_capa       text,                     -- hero cover photo URL
  fotos           jsonb default '[]'::jsonb, -- string[]
  momentos        jsonb default '[]'::jsonb, -- Momento[]
  ativo           boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update `updated_at`
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger paginas_casal_updated_at
  before update on paginas_casal
  for each row execute function update_updated_at();

-- RLS: public can read active pages; only authenticated users can write
alter table paginas_casal enable row level security;

create policy "Public pages are readable"
  on paginas_casal for select
  using (ativo = true);

create policy "Authenticated users can insert"
  on paginas_casal for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update their pages"
  on paginas_casal for update
  to authenticated
  using (true);

-- Index for fast slug lookups
create index if not exists idx_paginas_casal_slug on paginas_casal (slug);

-- ── Momento JSONB shape (reference, not enforced by Postgres) ─────────────────
-- {
--   "id":       "string",         -- UUID / nanoid
--   "data":     "YYYY-MM-DD",     -- ISO date
--   "titulo":   "string",
--   "descricao":"string",
--   "foto_url": "string | null"   -- optional
-- }
