-- ============================================================
-- BARTR — PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- USERS
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  college       VARCHAR(200),
  location      VARCHAR(100),
  bio           TEXT,
  avatar_url    TEXT,
  trust_score   NUMERIC(3,1) DEFAULT 5.0,
  credits       INT DEFAULT 10,
  is_verified   BOOLEAN DEFAULT FALSE,
  verify_token  TEXT,
  is_blocked    BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- SKILLS OFFERED / NEEDED
CREATE TABLE user_skills (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  type       VARCHAR(10) CHECK (type IN ('offer','need')),
  level      VARCHAR(20) CHECK (level IN ('beginner','intermediate','expert')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PORTFOLIO ITEMS
CREATE TABLE portfolio_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  media_url   TEXT,
  media_type  VARCHAR(20),
  link        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- SKILL LISTINGS
CREATE TABLE listings (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(200) NOT NULL,
  description  TEXT NOT NULL,
  category     VARCHAR(50) NOT NULL,
  skills_offered TEXT[] NOT NULL,
  skills_wanted  TEXT[] NOT NULL,
  credits_value  INT DEFAULT 0,
  status       VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','paused','closed')),
  views        INT DEFAULT 0,
  location     VARCHAR(100),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- BARTER REQUESTS
CREATE TABLE barter_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id      UUID REFERENCES listings(id) ON DELETE CASCADE,
  requester_id    UUID REFERENCES users(id),
  provider_id     UUID REFERENCES users(id),
  message         TEXT,
  offered_skills  TEXT[],
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending','accepted','rejected','active','completed','cancelled')),
  requester_done  BOOLEAN DEFAULT FALSE,
  provider_done   BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- CHAT ROOMS
CREATE TABLE chat_rooms (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barter_id   UUID REFERENCES barter_requests(id),
  user1_id    UUID REFERENCES users(id),
  user2_id    UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES
CREATE TABLE messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id    UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id  UUID REFERENCES users(id),
  content    TEXT NOT NULL,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RATINGS & REVIEWS
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barter_id   UUID REFERENCES barter_requests(id),
  reviewer_id UUID REFERENCES users(id),
  reviewee_id UUID REFERENCES users(id),
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(barter_id, reviewer_id)
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(50),
  title      VARCHAR(200),
  body       TEXT,
  link       TEXT,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- REPORTS
CREATE TABLE reports (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id),
  reported_id UUID REFERENCES users(id),
  reason      TEXT NOT NULL,
  status      VARCHAR(20) DEFAULT 'pending',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- CREDIT TRANSACTIONS
CREATE TABLE credit_transactions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id),
  amount     INT NOT NULL,
  type       VARCHAR(20) CHECK (type IN ('earn','spend','bonus')),
  note       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_user ON listings(user_id);
CREATE INDEX idx_listings_skills ON listings USING GIN(skills_offered);
CREATE INDEX idx_messages_room ON messages(room_id);
CREATE INDEX idx_barter_requester ON barter_requests(requester_id);
CREATE INDEX idx_barter_provider ON barter_requests(provider_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- UPDATE TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_listings_updated BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_barter_updated BEFORE UPDATE ON barter_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
