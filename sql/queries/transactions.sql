-- name: CreateTransaction :one
INSERT INTO transactions (
    subscription_id, amount, currency,
    payment_method, error_message
) VALUES (
    $1, $2, $3, $4, $5
) RETURNING *;

-- name: GetTransactionBySubscriptionID :one
SELECT * FROM transactions WHERE subscription_id = $1;

-- name: GetTransactions :many
SELECT * FROM transactions
WHERE subscription_id = $1
ORDER BY created_at DESC;

-- name: UpdateTransactionStatus :one
UPDATE transactions
SET status = $2,
    error_message = CASE 
        WHEN $2 = 'failed' THEN $3
        ELSE error_message
    END,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: GetTransactionsByStatus :many
SELECT t.*, 
       s.user_id,
       s.plan_id,
       s.billing_cycle
FROM transactions t
JOIN subscriptions s ON t.subscription_id = s.id
WHERE t.status = $1
ORDER BY t.created_at DESC
LIMIT $2;

-- name: GetUserTransactions :many
SELECT t.*
FROM transactions t
JOIN subscriptions s ON t.subscription_id = s.id
WHERE s.user_id = $1
ORDER BY t.created_at DESC;
