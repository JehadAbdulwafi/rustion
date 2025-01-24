-- +goose Up
CREATE TYPE transaction_status_enum AS ENUM ('pending', 'succeeded', 'failed');
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status transaction_status_enum NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(255),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- +goose Down
DROP TYPE IF EXISTS transaction_status_enum;
DROP TABLE IF EXISTS transactions;
