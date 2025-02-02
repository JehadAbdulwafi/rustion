-- +goose Up
CREATE TABLE email_verification_tokens (
    token UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_email_verification_tokens_fk_user_uid ON email_verification_tokens USING btree (user_id);

-- +goose Down
DROP TABLE IF EXISTS email_verification_tokens;

