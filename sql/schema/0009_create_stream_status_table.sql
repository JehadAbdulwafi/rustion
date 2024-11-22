-- +goose Up
CREATE TYPE stream_status_enum AS ENUM ('published', 'unpublished');

CREATE TABLE IF NOT EXISTS stream_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  status stream_status_enum NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  thumbnail VARCHAR(255),
  last_published_at TIMESTAMP,
  viewers INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- +goose Down
DROP TABLE IF EXISTS stream_metadata;
DROP TYPE IF EXISTS stream_status_enum;

