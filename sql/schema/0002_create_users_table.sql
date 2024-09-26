-- +goose Up
CREATE TABLE users (
  id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  name VARCHAR,
  email VARCHAR UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  is_verified boolean NOT NULL DEFAULT FALSE,
  is_active boolean NOT NULL DEFAULT FALSE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- +goose Down
DROP TABLE IF EXISTS users;

