-- name: CreateSubscription :one
INSERT INTO subscriptions (
    user_id, plan_id, status, billing_cycle,
    current_period_start, current_period_end
) VALUES (
    $1, $2, $3, $4, 
    $5, $6
) RETURNING *;

-- name: GetSubscription :one
SELECT s.*, 
       p.name as plan_name, 
       p.price_monthly, 
       p.price_yearly,
       p.features as plan_features
FROM subscriptions s
JOIN plans p ON s.plan_id = p.id
WHERE s.id = $1;

-- name: GetUserActiveSubscription :one
SELECT s.*, 
       p.name as plan_name, 
       p.price_monthly, 
       p.price_yearly,
       p.features as plan_features
FROM subscriptions s
JOIN plans p ON s.plan_id = p.id
WHERE s.user_id = $1 
AND s.status = 'active'::subscription_status_enum
AND s.current_period_end > CURRENT_TIMESTAMP;

-- name: GetUserSubscriptions :many
SELECT s.*, 
       p.name as plan_name, 
       p.price_monthly, 
       p.price_yearly,
       p.features as plan_features
FROM subscriptions s
JOIN plans p ON s.plan_id = p.id
WHERE s.user_id = $1 
AND s.current_period_end > CURRENT_TIMESTAMP;

-- name: UpdateSubscriptionStatus :one
UPDATE subscriptions
SET status = $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: UpgradeSubscription :one
UPDATE subscriptions
SET current_period_start = $3,
    current_period_end = $4,
    billing_cycle = $5,
    plan_id = $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: CancelSubscription :exec
UPDATE subscriptions
SET status = 'cancelled',
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: UpdateSubscriptionPeriod :one
UPDATE subscriptions
SET current_period_start = $2,
    current_period_end = $3,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: ListExpiredSubscriptions :many
SELECT s.*, 
       p.name as plan_name, 
       p.price_monthly, 
       p.price_yearly
FROM subscriptions s
JOIN plans p ON s.plan_id = p.id
WHERE s.current_period_end < CURRENT_TIMESTAMP
AND s.status = 'active';
