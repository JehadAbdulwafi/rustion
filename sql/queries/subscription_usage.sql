-- name: GetDailyStreamingUsage :one
SELECT COALESCE(streaming_minutes_used, 0)
FROM subscription_usage_daily
WHERE user_id = $1 AND usage_date = $2;

-- name: UpdateDailyStreamingUsage :exec
INSERT INTO subscription_usage_daily (user_id, subscription_id, streaming_minutes_used, usage_date)
VALUES ($1, $2, $3, $4)
ON CONFLICT (user_id, usage_date)
DO UPDATE SET streaming_minutes_used = subscription_usage_daily.streaming_minutes_used + EXCLUDED.streaming_minutes_used;

-- name: GetStorageUsage :one
SELECT COALESCE(storage_used_bytes, 0)
FROM subscription_usage_daily
WHERE user_id = $1 AND usage_date = CURRENT_DATE;

-- name: UpdateStorageUsage :exec
INSERT INTO subscription_usage_daily (user_id, subscription_id, storage_used_bytes, usage_date)
VALUES ($1, $2, $3, CURRENT_DATE)
ON CONFLICT (user_id, usage_date)
DO UPDATE SET storage_used_bytes = EXCLUDED.storage_used_bytes;

-- name: GetActivePlatformConnectionsCount :one
SELECT COALESCE(platforms_connected, 0)
FROM subscription_usage_daily
WHERE user_id = $1 AND usage_date = CURRENT_DATE;

-- name: IncrementPlatformConnections :exec
INSERT INTO subscription_usage_daily (user_id, subscription_id, platforms_connected, usage_date)
VALUES ($1, $2, 1, CURRENT_DATE)
ON CONFLICT (user_id, usage_date)
DO UPDATE SET platforms_connected = subscription_usage_daily.platforms_connected + 1;

-- name: DecrementPlatformConnections :exec
WITH ensure_record AS (
    INSERT INTO subscription_usage_daily (user_id, subscription_id, platforms_connected, usage_date)
    VALUES ($1, $2, 0, CURRENT_DATE)
    ON CONFLICT (user_id, usage_date) DO NOTHING
)
UPDATE subscription_usage_daily sud
SET platforms_connected = GREATEST(sud.platforms_connected - 1, 0)
WHERE sud.user_id = $1 AND sud.usage_date = CURRENT_DATE;

-- name: GetUserUsageByDateRange :many
SELECT 
    usage_date,
    streaming_minutes_used,
    storage_used_bytes,
    platforms_connected
FROM subscription_usage_daily
WHERE user_id = $1 
    AND usage_date BETWEEN $2 AND $3
ORDER BY usage_date DESC;

-- name: GetTotalUserUsage :one
SELECT 
    SUM(streaming_minutes_used) as total_streaming_minutes,
    MAX(storage_used_bytes) as current_storage_bytes,
    MAX(platforms_connected) as max_platforms_connected
FROM subscription_usage_daily
WHERE user_id = $1 
    AND usage_date BETWEEN $2 AND $3;

-- name: ResetDailyUsage :exec
INSERT INTO subscription_usage_daily (
    user_id,
    subscription_id,
    streaming_minutes_used,
    storage_used_bytes,
    platforms_connected,
    usage_date
)
SELECT 
    user_id,
    subscription_id,
    0, -- reset streaming minutes
    storage_used_bytes, -- maintain storage
    platforms_connected, -- maintain connections
    CURRENT_DATE
FROM subscription_usage_daily
WHERE usage_date = (CURRENT_DATE - INTERVAL '1 day')
ON CONFLICT (user_id, usage_date) DO NOTHING;


-- name: GetCurrentUsageStats :one
SELECT 
    streaming_minutes_used,
    storage_used_bytes,
    platforms_connected,
    created_at,
    updated_at
FROM subscription_usage_daily
WHERE user_id = $1 
    AND usage_date = CURRENT_DATE;

-- name: GetSubscriptionTotalUsage :one
SELECT 
    subscription_id,
    SUM(streaming_minutes_used) as total_streaming_minutes,
    SUM(storage_used_bytes) as total_storage_bytes,
    COUNT(DISTINCT user_id) as total_users,
    MAX(platforms_connected) as max_concurrent_platforms
FROM subscription_usage_daily
WHERE subscription_id = $1 
    AND usage_date BETWEEN $2 AND $3
GROUP BY subscription_id;

-- name: GetAllSubscriptionsUsage :many
SELECT 
    subscription_id,
    SUM(streaming_minutes_used) as total_streaming_minutes,
    SUM(storage_used_bytes) as total_storage_bytes,
    COUNT(DISTINCT user_id) as total_users,
    MAX(platforms_connected) as max_concurrent_platforms
FROM subscription_usage_daily
WHERE usage_date BETWEEN $1 AND $2
GROUP BY subscription_id;

-- name: GetSubscriptionDailyUsage :many
SELECT 
    usage_date,
    SUM(streaming_minutes_used) as daily_streaming_minutes,
    SUM(storage_used_bytes) as daily_storage_bytes,
    COUNT(DISTINCT user_id) as active_users,
    SUM(platforms_connected) as total_platforms
FROM subscription_usage_daily
WHERE subscription_id = $1 
    AND usage_date BETWEEN $2 AND $3
GROUP BY usage_date
ORDER BY usage_date DESC;
