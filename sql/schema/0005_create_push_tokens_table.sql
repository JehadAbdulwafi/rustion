-- +goose Up
CREATE TYPE provider_type AS ENUM (
    'fcm',
    'apn'
);

CREATE TABLE push_tokens (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    token TEXT UNIQUE NOT NULL,
    provider provider_type NOT NULL,
    user_id UUID NOT NULL REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
);

CREATE INDEX idx_push_tokens_fk_user_id ON push_tokens USING btree (user_id);
CREATE INDEX idx_push_tokens_token ON push_tokens USING btree (token);

-- +goose Down
DROP TABLE IF EXISTS push_tokens;

DROP TYPE IF EXISTS provider_type;

