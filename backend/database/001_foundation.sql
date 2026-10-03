CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  username TEXT,
  language_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id BIGINT NOT NULL REFERENCES users(id),
  user_b_id BIGINT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'rejected', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (user_a_id <> user_b_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS partnerships_active_user_a_idx
  ON partnerships (user_a_id) WHERE status = 'active';
CREATE UNIQUE INDEX IF NOT EXISTS partnerships_active_user_b_idx
  ON partnerships (user_b_id) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS partnership_invites (
  token_hash TEXT PRIMARY KEY,
  inviter_user_id BIGINT NOT NULL REFERENCES users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pet_species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  asset_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID NOT NULL REFERENCES partnerships(id),
  species_id UUID NOT NULL REFERENCES pet_species(id),
  rarity TEXT NOT NULL DEFAULT 'Common',
  variant TEXT NOT NULL DEFAULT 'default',
  level INTEGER NOT NULL DEFAULT 1 CHECK (level > 0),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS pets_one_active_per_partnership_idx
  ON pets (partnership_id) WHERE active = TRUE;

CREATE TABLE IF NOT EXISTS pet_stats (
  pet_id UUID PRIMARY KEY REFERENCES pets(id) ON DELETE CASCADE,
  health SMALLINT NOT NULL DEFAULT 100 CHECK (health BETWEEN 0 AND 100),
  energy SMALLINT NOT NULL DEFAULT 100 CHECK (energy BETWEEN 0 AND 100),
  hunger SMALLINT NOT NULL DEFAULT 100 CHECK (hunger BETWEEN 0 AND 100),
  thirst SMALLINT NOT NULL DEFAULT 100 CHECK (thirst BETWEEN 0 AND 100),
  mood SMALLINT NOT NULL DEFAULT 100 CHECK (mood BETWEEN 0 AND 100),
  cleanliness SMALLINT NOT NULL DEFAULT 100 CHECK (cleanliness BETWEEN 0 AND 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO pet_species (key, display_name, asset_url) VALUES
  ('cat', 'Cat', '/assets/pets/cat/body.glb'),
  ('dog', 'Dog', '/assets/pets/dog/body.glb'),
  ('monkey', 'Monkey', '/assets/pets/monkey/body.glb'),
  ('crocodile', 'Crocodile', '/assets/pets/crocodile/body.glb'),
  ('rabbit', 'Rabbit', '/assets/pets/rabbit/body.glb'),
  ('fox', 'Fox', '/assets/pets/fox/body.glb'),
  ('panda', 'Panda', '/assets/pets/panda/body.glb'),
  ('frog', 'Frog', '/assets/pets/frog/body.glb'),
  ('bear', 'Bear', '/assets/pets/bear/body.glb'),
  ('penguin', 'Penguin', '/assets/pets/penguin/body.glb')
ON CONFLICT (key) DO NOTHING;
