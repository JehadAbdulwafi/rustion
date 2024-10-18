-- +goose Up
CREATE TABLE featured_articles (
    id SERIAL PRIMARY KEY,
    featured_section_id INT REFERENCES featured_sections(id) ON DELETE CASCADE,
    news_id INT REFERENCES news(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_featured_section ON featured_articles(featured_section_id);
CREATE INDEX idx_news ON featured_articles(news_id);

-- +goose Down
DROP TABLE featured_articles;

