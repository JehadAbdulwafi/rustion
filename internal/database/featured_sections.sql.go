// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: featured_sections.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const createFeaturedArticle = `-- name: CreateFeaturedArticle :one
INSERT INTO featured_articles (featured_section_id, article_id)
VALUES ($1, $2)
RETURNING id, featured_section_id, article_id, created_at, updated_at
`

type CreateFeaturedArticleParams struct {
	FeaturedSectionID uuid.UUID
	ArticleID         uuid.UUID
}

func (q *Queries) CreateFeaturedArticle(ctx context.Context, arg CreateFeaturedArticleParams) (FeaturedArticle, error) {
	row := q.db.QueryRowContext(ctx, createFeaturedArticle, arg.FeaturedSectionID, arg.ArticleID)
	var i FeaturedArticle
	err := row.Scan(
		&i.ID,
		&i.FeaturedSectionID,
		&i.ArticleID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const createFeaturedSection = `-- name: CreateFeaturedSection :one
INSERT INTO featured_sections (title)
VALUES ($1)
RETURNING id, title, created_at, updated_at
`

func (q *Queries) CreateFeaturedSection(ctx context.Context, title string) (FeaturedSection, error) {
	row := q.db.QueryRowContext(ctx, createFeaturedSection, title)
	var i FeaturedSection
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteFeaturedArticle = `-- name: DeleteFeaturedArticle :exec
DELETE FROM featured_articles
WHERE id = $1
`

func (q *Queries) DeleteFeaturedArticle(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteFeaturedArticle, id)
	return err
}

const deleteFeaturedSection = `-- name: DeleteFeaturedSection :exec
DELETE FROM featured_sections
WHERE id = $1
`

func (q *Queries) DeleteFeaturedSection(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteFeaturedSection, id)
	return err
}

const getArticlesBySectionID = `-- name: GetArticlesBySectionID :many
SELECT a.id, a.title, a.description, a.content, a.image, a.tags, a.created_at, a.updated_at FROM articles a
JOIN featured_articles fa ON a.id = fa.article_id
JOIN featured_sections fs ON fs.id = fa.featured_section_id
WHERE fs.id = $1
`

func (q *Queries) GetArticlesBySectionID(ctx context.Context, id uuid.UUID) ([]Article, error) {
	rows, err := q.db.QueryContext(ctx, getArticlesBySectionID, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Article
	for rows.Next() {
		var i Article
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Description,
			&i.Content,
			&i.Image,
			&i.Tags,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getFeaturedArticle = `-- name: GetFeaturedArticle :one
SELECT id, featured_section_id, article_id, created_at, updated_at
FROM featured_articles
WHERE id = $1
`

func (q *Queries) GetFeaturedArticle(ctx context.Context, id uuid.UUID) (FeaturedArticle, error) {
	row := q.db.QueryRowContext(ctx, getFeaturedArticle, id)
	var i FeaturedArticle
	err := row.Scan(
		&i.ID,
		&i.FeaturedSectionID,
		&i.ArticleID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getFeaturedArticlesBySectionID = `-- name: GetFeaturedArticlesBySectionID :many
SELECT id, featured_section_id, article_id, created_at, updated_at
FROM featured_articles
WHERE featured_section_id = $1
`

func (q *Queries) GetFeaturedArticlesBySectionID(ctx context.Context, featuredSectionID uuid.UUID) ([]FeaturedArticle, error) {
	rows, err := q.db.QueryContext(ctx, getFeaturedArticlesBySectionID, featuredSectionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []FeaturedArticle
	for rows.Next() {
		var i FeaturedArticle
		if err := rows.Scan(
			&i.ID,
			&i.FeaturedSectionID,
			&i.ArticleID,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getFeaturedSection = `-- name: GetFeaturedSection :one
SELECT id, title, created_at, updated_at
FROM featured_sections
WHERE id = $1
`

func (q *Queries) GetFeaturedSection(ctx context.Context, id uuid.UUID) (FeaturedSection, error) {
	row := q.db.QueryRowContext(ctx, getFeaturedSection, id)
	var i FeaturedSection
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getFeaturedSections = `-- name: GetFeaturedSections :many
SELECT id, title, created_at, updated_at
FROM featured_sections
`

func (q *Queries) GetFeaturedSections(ctx context.Context) ([]FeaturedSection, error) {
	rows, err := q.db.QueryContext(ctx, getFeaturedSections)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []FeaturedSection
	for rows.Next() {
		var i FeaturedSection
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateFeaturedArticle = `-- name: UpdateFeaturedArticle :one
UPDATE featured_articles
SET featured_section_id = $1, article_id = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $3
RETURNING id, featured_section_id, article_id, created_at, updated_at
`

type UpdateFeaturedArticleParams struct {
	FeaturedSectionID uuid.UUID
	ArticleID         uuid.UUID
	ID                uuid.UUID
}

func (q *Queries) UpdateFeaturedArticle(ctx context.Context, arg UpdateFeaturedArticleParams) (FeaturedArticle, error) {
	row := q.db.QueryRowContext(ctx, updateFeaturedArticle, arg.FeaturedSectionID, arg.ArticleID, arg.ID)
	var i FeaturedArticle
	err := row.Scan(
		&i.ID,
		&i.FeaturedSectionID,
		&i.ArticleID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const updateFeaturedSection = `-- name: UpdateFeaturedSection :one
UPDATE featured_sections
SET title = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING id, title, created_at, updated_at
`

type UpdateFeaturedSectionParams struct {
	Title string
	ID    uuid.UUID
}

func (q *Queries) UpdateFeaturedSection(ctx context.Context, arg UpdateFeaturedSectionParams) (FeaturedSection, error) {
	row := q.db.QueryRowContext(ctx, updateFeaturedSection, arg.Title, arg.ID)
	var i FeaturedSection
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
