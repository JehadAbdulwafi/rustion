// Code generated by go-swagger; DO NOT EDIT.

package types

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"
	"strconv"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// GetAllFeaturedSectionsWithArticlesResponse get all featured sections with articles response
//
// swagger:model getAllFeaturedSectionsWithArticlesResponse
type GetAllFeaturedSectionsWithArticlesResponse []*GetAllFeaturedSectionsWithArticlesResponseItems0

// Validate validates this get all featured sections with articles response
func (m GetAllFeaturedSectionsWithArticlesResponse) Validate(formats strfmt.Registry) error {
	var res []error

	for i := 0; i < len(m); i++ {
		if swag.IsZero(m[i]) { // not required
			continue
		}

		if m[i] != nil {
			if err := m[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName(strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName(strconv.Itoa(i))
				}
				return err
			}
		}

	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// ContextValidate validate this get all featured sections with articles response based on the context it is used
func (m GetAllFeaturedSectionsWithArticlesResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	for i := 0; i < len(m); i++ {

		if m[i] != nil {

			if swag.IsZero(m[i]) { // not required
				return nil
			}

			if err := m[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName(strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName(strconv.Itoa(i))
				}
				return err
			}
		}

	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// GetAllFeaturedSectionsWithArticlesResponseItems0 get all featured sections with articles response items0
//
// swagger:model GetAllFeaturedSectionsWithArticlesResponseItems0
type GetAllFeaturedSectionsWithArticlesResponseItems0 struct {

	// featured article created at
	// Example: 2023-10-01T12:00:00Z
	// Format: date-time
	FeaturedArticleCreatedAt strfmt.DateTime `json:"featured_article_created_at,omitempty"`

	// featured article id
	// Example: 1
	FeaturedArticleID int64 `json:"featured_article_id,omitempty"`

	// featured article updated at
	// Example: 2023-10-02T12:00:00Z
	// Format: date-time
	FeaturedArticleUpdatedAt strfmt.DateTime `json:"featured_article_updated_at,omitempty"`

	// news content
	// Example: This is the content of the news article.
	NewsContent string `json:"news_content,omitempty"`

	// news id
	// Example: 1
	NewsID int64 `json:"news_id,omitempty"`

	// news title
	// Example: Breaking News Title
	NewsTitle string `json:"news_title,omitempty"`

	// section id
	// Example: 1
	SectionID int64 `json:"section_id,omitempty"`

	// section title
	// Example: Top Stories
	SectionTitle string `json:"section_title,omitempty"`
}

// Validate validates this get all featured sections with articles response items0
func (m *GetAllFeaturedSectionsWithArticlesResponseItems0) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateFeaturedArticleCreatedAt(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateFeaturedArticleUpdatedAt(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *GetAllFeaturedSectionsWithArticlesResponseItems0) validateFeaturedArticleCreatedAt(formats strfmt.Registry) error {
	if swag.IsZero(m.FeaturedArticleCreatedAt) { // not required
		return nil
	}

	if err := validate.FormatOf("featured_article_created_at", "body", "date-time", m.FeaturedArticleCreatedAt.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *GetAllFeaturedSectionsWithArticlesResponseItems0) validateFeaturedArticleUpdatedAt(formats strfmt.Registry) error {
	if swag.IsZero(m.FeaturedArticleUpdatedAt) { // not required
		return nil
	}

	if err := validate.FormatOf("featured_article_updated_at", "body", "date-time", m.FeaturedArticleUpdatedAt.String(), formats); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this get all featured sections with articles response items0 based on context it is used
func (m *GetAllFeaturedSectionsWithArticlesResponseItems0) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *GetAllFeaturedSectionsWithArticlesResponseItems0) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *GetAllFeaturedSectionsWithArticlesResponseItems0) UnmarshalBinary(b []byte) error {
	var res GetAllFeaturedSectionsWithArticlesResponseItems0
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
