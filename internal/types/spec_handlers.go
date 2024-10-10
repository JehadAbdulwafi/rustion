// Code generated by go-swagger; DO NOT EDIT.

package types

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

// NewSwaggerSpec creates a new SwaggerSpec instance
func NewSwaggerSpec() *SwaggerSpec {

	spec := &SwaggerSpec{
		Handlers: make(map[string]map[string]bool),
	}

	if len(spec.Handlers) == 0 {
		spec.initHandlerCache()
	}

	return spec
}

/*SwaggerSpec API documentation */
type SwaggerSpec struct {
	Handlers map[string]map[string]bool
}

func (o *SwaggerSpec) initHandlerCache() {
	o.Handlers = make(map[string]map[string]bool)

	// https://swagger.io/specification/v2/ fixed fields: GET, PUT, POST, DELETE, OPTIONS, HEAD, PATCH
	o.Handlers["GET"] = make(map[string]bool)
	o.Handlers["PUT"] = make(map[string]bool)
	o.Handlers["POST"] = make(map[string]bool)
	o.Handlers["DELETE"] = make(map[string]bool)
	o.Handlers["OPTIONS"] = make(map[string]bool)
	o.Handlers["HEAD"] = make(map[string]bool)
	o.Handlers["PATCH"] = make(map[string]bool)

	o.Handlers["GET"]["/api/v1/auth/userinfo"] = true
	o.Handlers["POST"]["/api/v1/stream"] = true
	o.Handlers["POST"]["/api/v1/auth/login"] = true
	o.Handlers["POST"]["/api/v1/stream/publish"] = true
	o.Handlers["POST"]["/api/v1/auth/register"] = true
	o.Handlers["POST"]["/api/v1/stream/unpublish"] = true
}
