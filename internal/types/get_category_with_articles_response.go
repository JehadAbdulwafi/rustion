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
)

// GetCategoryWithArticlesResponse get category with articles response
//
// swagger:model getCategoryWithArticlesResponse
type GetCategoryWithArticlesResponse struct {

	// articles
	Articles []*GetCategoryWithArticlesResponseArticlesItems `json:"articles"`

	// category
	Category *Category `json:"category,omitempty"`
}

// Validate validates this get category with articles response
func (m *GetCategoryWithArticlesResponse) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateArticles(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateCategory(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *GetCategoryWithArticlesResponse) validateArticles(formats strfmt.Registry) error {
	if swag.IsZero(m.Articles) { // not required
		return nil
	}

	for i := 0; i < len(m.Articles); i++ {
		if swag.IsZero(m.Articles[i]) { // not required
			continue
		}

		if m.Articles[i] != nil {
			if err := m.Articles[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("articles" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("articles" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

func (m *GetCategoryWithArticlesResponse) validateCategory(formats strfmt.Registry) error {
	if swag.IsZero(m.Category) { // not required
		return nil
	}

	if m.Category != nil {
		if err := m.Category.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("category")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("category")
			}
			return err
		}
	}

	return nil
}

// ContextValidate validate this get category with articles response based on the context it is used
func (m *GetCategoryWithArticlesResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidateArticles(ctx, formats); err != nil {
		res = append(res, err)
	}

	if err := m.contextValidateCategory(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *GetCategoryWithArticlesResponse) contextValidateArticles(ctx context.Context, formats strfmt.Registry) error {

	for i := 0; i < len(m.Articles); i++ {

		if m.Articles[i] != nil {

			if swag.IsZero(m.Articles[i]) { // not required
				return nil
			}

			if err := m.Articles[i].ContextValidate(ctx, formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("articles" + "." + strconv.Itoa(i))
				} else if ce, ok := err.(*errors.CompositeError); ok {
					return ce.ValidateName("articles" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

func (m *GetCategoryWithArticlesResponse) contextValidateCategory(ctx context.Context, formats strfmt.Registry) error {

	if m.Category != nil {

		if swag.IsZero(m.Category) { // not required
			return nil
		}

		if err := m.Category.ContextValidate(ctx, formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("category")
			} else if ce, ok := err.(*errors.CompositeError); ok {
				return ce.ValidateName("category")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *GetCategoryWithArticlesResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *GetCategoryWithArticlesResponse) UnmarshalBinary(b []byte) error {
	var res GetCategoryWithArticlesResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
