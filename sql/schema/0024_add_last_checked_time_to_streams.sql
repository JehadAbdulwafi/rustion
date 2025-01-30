-- +goose Up
ALTER TABLE streams 
  ADD COLUMN last_checked_time TIMESTAMP NOT NULL DEFAULT NOW();

-- +goose Down
ALTER TABLE streams DROP COLUMN last_checked_time;
