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

// PostLoginResponse post login response
//
// swagger:model postLoginResponse
type PostLoginResponse struct {

	// Access token required for accessing protected API endpoints
	// Example: eyJhdWQiOiJjdXN0b2...
	// Required: true
	AccessToken *string `json:"access_token"`

	// Refresh token for refreshing the access token once it expires
	// Example: eyJhdWQiOiJjdXN0b2...
	// Required: true
	RefreshToken *string `json:"refresh_token"`
}

// Validate validates this post login response
func (m *PostLoginResponse) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateAccessToken(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateRefreshToken(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *PostLoginResponse) validateAccessToken(formats strfmt.Registry) error {

	if err := validate.Required("access_token", "body", m.AccessToken); err != nil {
		return err
	}

	return nil
}

func (m *PostLoginResponse) validateRefreshToken(formats strfmt.Registry) error {

	if err := validate.Required("refresh_token", "body", m.RefreshToken); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this post login response based on context it is used
func (m *PostLoginResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *PostLoginResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *PostLoginResponse) UnmarshalBinary(b []byte) error {
	var res PostLoginResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
