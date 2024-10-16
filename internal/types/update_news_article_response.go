// Code generated by go-swagger; DO NOT EDIT.

package types

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"

	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// UpdateNewsArticleResponse update news article response
//
// swagger:model updateNewsArticleResponse
type UpdateNewsArticleResponse struct {

	// message
	// Example: Article updated successfully.
	Message string `json:"message,omitempty"`
}

// Validate validates this update news article response
func (m *UpdateNewsArticleResponse) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this update news article response based on context it is used
func (m *UpdateNewsArticleResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *UpdateNewsArticleResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *UpdateNewsArticleResponse) UnmarshalBinary(b []byte) error {
	var res UpdateNewsArticleResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
