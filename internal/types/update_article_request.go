// Code generated by go-swagger; DO NOT EDIT.

package types

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// UpdateArticleRequest update article request
//
// swagger:model updateArticleRequest
type UpdateArticleRequest struct {

	// ID of category
	// Example: 82ebdfad-c586-4407-a873-4cc1c33d56fc
	// Format: uuid4
	CategoryID strfmt.UUID4 `json:"category_id,omitempty"`

	// Content of the article
	// Example: This is the content of the article.
	// Required: true
	Content *string `json:"content"`

	// Description of the article
	// Example: This is the description of the article.
	Description string `json:"description,omitempty"`

	// Image of the article
	// Example: https://example.com/article-image.jpg
	// Required: true
	Image *string `json:"image"`

	// Title of the article
	// Example: Article Title
	// Required: true
	// Max Length: 255
	Title *string `json:"title"`
}

// Validate validates this update article request
func (m *UpdateArticleRequest) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateCategoryID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateContent(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateImage(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateTitle(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *UpdateArticleRequest) validateCategoryID(formats strfmt.Registry) error {
	if swag.IsZero(m.CategoryID) { // not required
		return nil
	}

	if err := validate.FormatOf("category_id", "body", "uuid4", m.CategoryID.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *UpdateArticleRequest) validateContent(formats strfmt.Registry) error {

	if err := validate.Required("content", "body", m.Content); err != nil {
		return err
	}

	return nil
}

func (m *UpdateArticleRequest) validateImage(formats strfmt.Registry) error {

	if err := validate.Required("image", "body", m.Image); err != nil {
		return err
	}

	return nil
}

func (m *UpdateArticleRequest) validateTitle(formats strfmt.Registry) error {

	if err := validate.Required("title", "body", m.Title); err != nil {
		return err
	}

	if err := validate.MaxLength("title", "body", *m.Title, 255); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this update article request based on context it is used
func (m *UpdateArticleRequest) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *UpdateArticleRequest) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *UpdateArticleRequest) UnmarshalBinary(b []byte) error {
	var res UpdateArticleRequest
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
