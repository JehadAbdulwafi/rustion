-- +goose Up
CREATE TYPE feedback_type_enum AS ENUM ('suggestion', 'bug', 'general');
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  "subject" VARCHAR(255) NOT NULL,
  "type" feedback_type_enum NOT NULL DEFAULT 'general',
  "message" TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- +goose Down
DROP TABLE IF EXISTS feedbacks;
DROP TYPE IF EXISTS feedback_type_enum;