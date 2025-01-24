-- name: CreatePlan :one
INSERT INTO plans (
    name, description, price_monthly, price_yearly, features, is_active
) VALUES (
    $1, $2, $3, $4, $5, $6
) RETURNING *;

-- name: GetPlan :one
SELECT * FROM plans WHERE id = $1;

-- name: GetActivePlans :many
SELECT * FROM plans 
WHERE is_active = true 
ORDER BY price_monthly ASC;

-- name: GetPlans :many
SELECT * FROM plans ORDER BY price_monthly ASC;

-- name: UpdatePlan :one
UPDATE plans
SET name = $2,
    description = $3,
    price_monthly = $4,
    price_yearly = $5,
    features = $6,
    is_active = $7,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: DeactivatePlan :one
UPDATE plans
SET is_active = false,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
