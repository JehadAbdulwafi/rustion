-- +goose Up
CREATE SEQUENCE seq_health;

-- +goose Down
DROP SEQUENCE IF EXISTS seq_health;

