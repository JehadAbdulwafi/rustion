-- +goose Up
CREATE TABLE IF NOT EXISTS subscription_usage_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    streaming_minutes_used INT NOT NULL DEFAULT 0,
    platforms_connected INT NOT NULL DEFAULT 0,
    storage_used_bytes BIGINT NOT NULL DEFAULT 0,
    usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(user_id, usage_date)
);

-- +goose Down
DROP TABLE IF EXISTS subscription_usage_daily;
