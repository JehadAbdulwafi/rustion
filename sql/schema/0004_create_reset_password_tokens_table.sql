-- +goose Up
CREATE TABLE password_reset_tokens (
    token UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    valid_until TIMESTAMP NOT NULL,
    user_id UUID NOT NULL REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_password_reset_tokens_fk_user_uid ON password_reset_tokens USING btree (user_id);

-- +goose Down
DROP TABLE IF EXISTS password_reset_tokens;

