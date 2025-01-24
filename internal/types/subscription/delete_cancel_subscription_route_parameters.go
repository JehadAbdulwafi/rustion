// Code generated by go-swagger; DO NOT EDIT.

package subscription

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
)

// NewDeleteCancelSubscriptionRouteParams creates a new DeleteCancelSubscriptionRouteParams object
// no default values defined in spec.
func NewDeleteCancelSubscriptionRouteParams() DeleteCancelSubscriptionRouteParams {

	return DeleteCancelSubscriptionRouteParams{}
}

// DeleteCancelSubscriptionRouteParams contains all the bound params for the delete cancel subscription route operation
// typically these are obtained from a http.Request
//
// swagger:parameters DeleteCancelSubscriptionRoute
type DeleteCancelSubscriptionRouteParams struct {

	// HTTP Request Object
	HTTPRequest *http.Request `json:"-"`
}

// BindRequest both binds and validates a request, it assumes that complex things implement a Validatable(strfmt.Registry) error interface
// for simple values it will use straight method calls.
//
// To ensure default values, the struct must have been initialized with NewDeleteCancelSubscriptionRouteParams() beforehand.
func (o *DeleteCancelSubscriptionRouteParams) BindRequest(r *http.Request, route *middleware.MatchedRoute) error {
	var res []error

	o.HTTPRequest = r

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *DeleteCancelSubscriptionRouteParams) Validate(formats strfmt.Registry) error {
	var res []error

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}
