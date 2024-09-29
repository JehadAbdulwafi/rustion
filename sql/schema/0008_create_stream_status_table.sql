-- +goose Up
CREATE TYPE stream_status_enum AS ENUM ('online', 'offline', 'scheduled');

CREATE TABLE IF NOT EXISTS stream_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  status stream_status_enum NOT NULL,
  est_start_time TIMESTAMP,
  last_published_at TIMESTAMP,
  viewers_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- +goose Down
DROP TABLE IF EXISTS stream_status;
DROP TYPE IF EXISTS stream_status_enum;

