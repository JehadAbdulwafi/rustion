-- +goose Up
CREATE TABLE IF NOT EXISTS featured_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  featured_section_id UUID NOT NULL REFERENCES featured_sections(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX idx_featured_section ON featured_articles(featured_section_id);
CREATE INDEX idx_article ON featured_articles(article_id);

-- +goose Down
DROP TABLE IF EXISTS featured_articles;

