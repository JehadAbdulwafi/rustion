-- +goose Up
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  content TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  tags TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- +goose Down
DROP TABLE IF EXISTS articles;

