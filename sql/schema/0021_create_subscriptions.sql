-- +goose Up
CREATE TYPE subscription_status_enum AS ENUM ('active', 'cancelled', 'expired', 'pending');
CREATE TYPE subscription_billing_cycle_enum AS ENUM ('monthly', 'yearly');
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    status subscription_status_enum NOT NULL DEFAULT 'pending',
    billing_cycle subscription_billing_cycle_enum NOT NULL DEFAULT 'monthly',
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- +goose Down
DROP TYPE IF EXISTS subscription_status_enum;
DROP TYPE IF EXISTS subscription_billing_cycle_enum;
DROP TABLE IF EXISTS subscriptions;
