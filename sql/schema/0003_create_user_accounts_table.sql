-- +goose Up
CREATE TABLE IF NOT EXISTS accounts
(
  id SERIAL,
  user_id UUID NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  valid_until TIMESTAMP NOT NULL,
  scope TEXT,
  token_type TEXT,
  PRIMARY KEY (id)
);


-- +goose Down
DROP TABLE IF EXISTS accounts;

