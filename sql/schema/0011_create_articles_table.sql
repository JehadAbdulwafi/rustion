-- +goose Up
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX idx_articles_category ON articles(category_id);

-- +goose Down
DROP TABLE IF EXISTS articles;

