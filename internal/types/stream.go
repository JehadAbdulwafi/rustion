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

// Stream stream
//
// swagger:model stream
type Stream struct {

	// app
	// Required: true
	App *string `json:"app"`

	// created at
	CreatedAt string `json:"createdAt,omitempty"`

	// id
	// Required: true
	// Format: uuid4
	ID *strfmt.UUID4 `json:"id"`

	// last published at
	// Required: true
	LastPublishedAt *string `json:"lastPublishedAt"`

	// live description
	// Required: true
	LiveDescription *string `json:"liveDescription"`

	// live title
	// Required: true
	LiveTitle *string `json:"liveTitle"`

	// name
	// Required: true
	Name *string `json:"name"`

	// password
	Password string `json:"password,omitempty"`

	// status
	// Required: true
	Status *string `json:"status"`

	// thumbnail
	// Required: true
	Thumbnail *string `json:"thumbnail"`

	// updated at
	UpdatedAt string `json:"updatedAt,omitempty"`

	// url
	// Required: true
	URL *string `json:"url"`

	// user ID
	// Required: true
	// Format: uuid4
	UserID *strfmt.UUID4 `json:"userID"`

	// viewers
	// Required: true
	Viewers *string `json:"viewers"`
}

// Validate validates this stream
func (m *Stream) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateApp(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateLastPublishedAt(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateLiveDescription(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateLiveTitle(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateName(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateStatus(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateThumbnail(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateURL(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateUserID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateViewers(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *Stream) validateApp(formats strfmt.Registry) error {

	if err := validate.Required("app", "body", m.App); err != nil {
		return err
	}

	return nil
}

func (m *Stream) validateID(formats strfmt.Registry) error {

	if err := validate.Required("id", "body", m.ID); err != nil {
		return err
	}

	if err := validate.FormatOf("id", "body", "uuid4", m.ID.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *Stream) validateLastPublishedAt(formats strfmt.Registry) error {

	if err := validate.Required("lastPublishedAt", "body", m.LastPublishedAt); err != nil {
		return err
	}

	return nil
}

func (m *Stream) validateLiveDescription(formats strfmt.Registry) error {

	if err := validate.Required("liveDescription", "body", m.LiveDescription); err != nil {
		return err
	}

	return nil
}

func (m *Stream) validateLiveTitle(formats strfmt.Registry) error {

	if err := validate.Required("liveTitle", "body", m.LiveTitle); err != nil {
		return err
	}

	return nil
}

func (m *Stream) validateName(formats strfmt.Registry) error {

	if err := validate.Required("name", "body", m.Name); err != nil {
		return err
	}

	return nil
}

func (m *Stream) validateStatus(formats strfmt.Registry) error {

	if err := validate.Required("status", "body", m.Status); err != nil {
		return err
	}

	return nil
}

func (m *Stream) validateThumbnail(formats strfmt.Registry) error {

	if err := validate.Required("thumbnail", "body", m.Thumbnail); err != nil {
		return err
	}

	return nil
}

func (m *Stream) validateURL(formats strfmt.Registry) error {

	if err := validate.Required("url", "body", m.URL); err != nil {
		return err
	}

	return nil
}

func (m *Stream) validateUserID(formats strfmt.Registry) error {

	if err := validate.Required("userID", "body", m.UserID); err != nil {
		return err
	}

	if err := validate.FormatOf("userID", "body", "uuid4", m.UserID.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *Stream) validateViewers(formats strfmt.Registry) error {

	if err := validate.Required("viewers", "body", m.Viewers); err != nil {
		return err
	}

	return nil
}

// ContextValidate validates this stream based on context it is used
func (m *Stream) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *Stream) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *Stream) UnmarshalBinary(b []byte) error {
	var res Stream
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
