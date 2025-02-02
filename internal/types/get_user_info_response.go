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

// GetUserInfoResponse get user info response
//
// swagger:model getUserInfoResponse
type GetUserInfoResponse struct {

	// ID of app
	// Example: 82ebdfad-c586-4407-a873-4cc1c33d56fc
	AppID string `json:"app_id,omitempty"`

	// Email address of user, if available
	// Example: user@example.com
	// Required: true
	// Max Length: 255
	// Format: email
	Email *strfmt.Email `json:"email"`

	// ID of user
	// Example: 82ebdfad-c586-4407-a873-4cc1c33d56fc
	// Required: true
	ID *string `json:"id"`

	// name of user
	// Example: john doe
	// Required: true
	Name *string `json:"name"`
}

// Validate validates this get user info response
func (m *GetUserInfoResponse) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateEmail(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateName(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *GetUserInfoResponse) validateEmail(formats strfmt.Registry) error {

	if err := validate.Required("email", "body", m.Email); err != nil {
		return err
	}

	if err := validate.MaxLength("email", "body", m.Email.String(), 255); err != nil {
		return err
	}

	if err := validate.FormatOf("email", "body", "email", m.Email.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *GetUserInfoResponse) validateID(formats strfmt.Registry) error {

	if err := validate.Required("id", "body", m.ID); err != nil {
		return err
	}

	return nil
}

func (m *GetUserInfoResponse) validateName(formats strfmt.Registry) error {

	if err := validate.Required("name", "body", m.Name); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this get user info response based on context it is used
func (m *GetUserInfoResponse) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *GetUserInfoResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *GetUserInfoResponse) UnmarshalBinary(b []byte) error {
	var res GetUserInfoResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
