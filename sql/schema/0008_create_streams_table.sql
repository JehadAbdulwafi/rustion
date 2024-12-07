-- +goose Up
CREATE TYPE stream_status_enum AS ENUM ('published', 'unpublished');
CREATE TABLE IF NOT EXISTS streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  host VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  thumbnail VARCHAR(255),
  status stream_status_enum NOT NULL DEFAULT 'unpublished',
  viewers INT DEFAULT 0,
  last_published_at TIMESTAMP,
  live_title VARCHAR(255),
  live_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- +goose Down
DROP TABLE IF EXISTS streams;
DROP TYPE IF EXISTS stream_status_enum;
