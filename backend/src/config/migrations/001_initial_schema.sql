-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TYPE difficulty_level AS ENUM (
  'easy', 'moderate', 'challenging', 'extreme'
);

CREATE TYPE booking_status AS ENUM (
  'pending', 'confirmed', 'cancelled', 'completed'
);

CREATE TYPE payment_status AS ENUM (
  'unpaid', 'partially_paid', 'paid', 'refunded'
);

-- ============================================
-- 2. USERS TABLE
-- ============================================

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  role          user_role DEFAULT 'user',
  phone         VARCHAR(20),
  avatar_url    TEXT,
  nationality   VARCHAR(100),
  is_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- Index for fast email lookups (used in login)
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 3. TREKS TABLE
-- ============================================

CREATE TABLE treks (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) NOT NULL UNIQUE,  -- for SEO URLs: /treks/everest-base-camp
  description     TEXT NOT NULL,
  highlights      TEXT[],                         -- array of highlight points
  itinerary       JSONB,                          -- day-by-day plan as JSON
  difficulty      difficulty_level NOT NULL,
  duration_days   INT NOT NULL,
  max_altitude    INT,                            -- in meters
  distance_km     DECIMAL(8,2),
  price           DECIMAL(10,2) NOT NULL,
  discount_price  DECIMAL(10,2),                 -- for sale prices
  max_group_size  INT DEFAULT 12,
  min_group_size  INT DEFAULT 1,
  region          VARCHAR(100),                  -- Everest, Annapurna, Langtang
  start_location  VARCHAR(255),
  end_location    VARCHAR(255),
  cover_image     TEXT,
  is_featured     BOOLEAN DEFAULT FALSE,
  is_homepage     BOOLEAN DEFAULT FASLE,
  is_active       BOOLEAN DEFAULT TRUE,
  meta_title      VARCHAR(255),                  -- SEO
  meta_description TEXT,                         -- SEO
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_treks_slug       ON treks(slug);
CREATE INDEX idx_treks_region     ON treks(region);
CREATE INDEX idx_treks_difficulty ON treks(difficulty);
CREATE INDEX idx_treks_featured   ON treks(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_homepage_featured   ON treks(is_homepage) WHERE is_homepage = TRUE;
CREATE INDEX idx_treks_active     ON treks(is_active) WHERE is_active = TRUE;

-- ============================================
-- 4. TREK IMAGES TABLE
-- ============================================

CREATE TABLE trek_images (
  id          SERIAL PRIMARY KEY,
  trek_id     INT NOT NULL REFERENCES treks(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  caption     VARCHAR(255),
  is_cover    BOOLEAN DEFAULT FALSE,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_trek_images_trek_id ON trek_images(trek_id);

-- ============================================
-- 5. BOOKINGS TABLE
-- ============================================

CREATE TABLE bookings (
  id               SERIAL PRIMARY KEY,
  user_id          INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  trek_id          INT NOT NULL REFERENCES treks(id) ON DELETE RESTRICT,
  booking_date     DATE NOT NULL,               -- the date they want to start
  num_travelers    INT NOT NULL DEFAULT 1,
  total_price      DECIMAL(10,2) NOT NULL,
  status           booking_status DEFAULT 'pending',
  payment_status   payment_status DEFAULT 'unpaid',
  special_requests TEXT,
  emergency_contact VARCHAR(255),
  notes            TEXT,                        -- admin notes
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW(),

  -- Prevent double booking same user same trek same date
  CONSTRAINT unique_booking UNIQUE (user_id, trek_id, booking_date)
);

CREATE INDEX idx_bookings_user_id  ON bookings(user_id);
CREATE INDEX idx_bookings_trek_id  ON bookings(trek_id);
CREATE INDEX idx_bookings_status   ON bookings(status);
CREATE INDEX idx_bookings_date     ON bookings(booking_date);

-- ============================================
-- 6. REVIEWS TABLE
-- ============================================

CREATE TABLE reviews (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trek_id     INT NOT NULL REFERENCES treks(id) ON DELETE CASCADE,
  rating      INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title       VARCHAR(255),
  comment     TEXT,
  is_approved BOOLEAN DEFAULT FALSE,   -- admin must approve before showing
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW(),

  -- One review per user per trek
  CONSTRAINT unique_review UNIQUE (user_id, trek_id)
);

CREATE INDEX idx_reviews_trek_id    ON reviews(trek_id);
CREATE INDEX idx_reviews_approved   ON reviews(is_approved) WHERE is_approved = TRUE;

-- ============================================
-- 7. AUTO-UPDATE updated_at TRIGGER
-- ============================================

-- Function that sets updated_at to NOW()
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treks_updated_at
  BEFORE UPDATE ON treks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fix typo
ALTER TABLE treks ALTER COLUMN is_homepage SET DEFAULT FALSE;

-- 1. New regions table — one row per nav category (Everest, Annapurna, etc.)
CREATE TABLE regions (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,       -- "Everest Region"
  slug           VARCHAR(100) NOT NULL UNIQUE, -- "everest" -> used in /treks?region=everest
  tagline        VARCHAR(255),                 -- "Roof of the World"
  display_order  INT DEFAULT 0,                -- controls left-column order in mega menu
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);

-- 2. Link treks to regions properly (replaces free-text matching)
ALTER TABLE treks ADD COLUMN region_id INT REFERENCES regions(id);

-- 3. Menu-specific controls on treks
ALTER TABLE treks ADD COLUMN show_in_menu BOOLEAN DEFAULT TRUE;  -- include in the mega menu's sub-list at all
ALTER TABLE treks ADD COLUMN menu_order   INT DEFAULT 0;         -- order within that region's sub-list
ALTER TABLE treks ADD COLUMN is_promo     BOOLEAN DEFAULT FALSE; -- show as a promo card (pick top 2 per region)

CREATE INDEX idx_treks_region_id ON treks(region_id);
CREATE INDEX idx_treks_promo     ON treks(is_promo) WHERE is_promo = TRUE;

INSERT INTO regions (name, slug, tagline, display_order) VALUES
('Everest Region', 'everest', 'Roof of the World', 1),
('Annapurna Region', 'annapurna', 'Sanctuary of Giants', 2),
('Langtang Region', 'langtang', 'Valley of Glaciers', 3),
('Manaslu Region', 'manaslu', 'The Hidden Giant', 4),
('Mustang & Dolpo', 'mustang', 'The Forbidden Kingdom', 5);

ALTER TABLE treks ADD COLUMN is_expedition BOOLEAN DEFAULT FALSE;

-- Partial index — matches the pattern you already used for is_featured.
-- Postgres only indexes the TRUE rows, so lookups stay tiny even as the table grows.
CREATE INDEX idx_treks_expedition ON treks(is_expedition) WHERE is_expedition = TRUE;

INSERT INTO treks (title, slug, description, difficulty, duration_days, max_altitude, price, region, is_featured, meta_title, meta_description)
VALUES
(
  'Everest Base Camp Trek',
  'everest-base-camp',
  'The most iconic trek in the world. Walk in the footsteps of legends to the base of the world''s highest peak at 5,364m.',
  'challenging',
  14,
  5364,
  1299.00,
  'Everest',
  TRUE,
  'Everest Base Camp Trek | 14 Days | Himalaya Treks',
  'Book the legendary Everest Base Camp Trek. 14 days through Sherpa villages, monasteries and glaciers to 5,364m.'
),
(
  'Annapurna Circuit Trek',
  'annapurna-circuit',
  'One of the world''s greatest treks, circling the entire Annapurna massif through diverse landscapes and cultures.',
  'moderate',
  18,
  5416,
  1099.00,
  'Annapurna',
  TRUE,
  'Annapurna Circuit Trek | 18 Days | Himalaya Treks',
  'Trek the full Annapurna Circuit over Thorong La Pass at 5,416m. 18 days of stunning Himalayan scenery.'
),
(
  'Langtang Valley Trek',
  'langtang-valley',
  'A hidden gem close to Kathmandu. Trek through the Langtang National Park with stunning mountain views and Tamang culture.',
  'moderate',
  10,
  3870,
  699.00,
  'Langtang',
  FALSE,
  'Langtang Valley Trek | 10 Days | Himalaya Treks',
  'Discover the Langtang Valley, Nepal''s closest trek to Kathmandu. 10 days through forests and high alpine meadows.'
);