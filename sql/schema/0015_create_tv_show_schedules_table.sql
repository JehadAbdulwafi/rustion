-- +goose Up
CREATE TYPE day_enum AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
CREATE TABLE IF NOT EXISTS tv_show_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tv_show_id UUID NOT NULL REFERENCES tv_shows(id) ON DELETE CASCADE,
  day day_enum NOT NULL,
  time TIME,
  is_active BOOLEAN NOT NULL DEFAULT false
);

-- +goose Down
DROP TYPE IF EXISTS day_enum;
DROP TABLE IF EXISTS tv_show_schedules;
