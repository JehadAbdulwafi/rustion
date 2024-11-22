-- +goose Up
CREATE TYPE provider_type AS ENUM (
    'fcm',
    'apn'
);

CREATE TABLE push_tokens (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    token TEXT UNIQUE NOT NULL,
    provider provider_type NOT NULL,
    fingerprint TEXT NOT NULL,
    app_id UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_push_tokens_token ON push_tokens USING btree (token);
CREATE INDEX idx_push_tokens_fingerprint ON push_tokens USING btree (fingerprint);

-- +goose Down
DROP TABLE IF EXISTS push_tokens;

DROP TYPE IF EXISTS provider_type;

