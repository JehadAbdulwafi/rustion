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

	o.Handlers["DELETE"]["/api/v1/apps/{id}"] = true
	o.Handlers["DELETE"]["/api/v1/articles/{id}"] = true
	o.Handlers["DELETE"]["/api/v1/subscriptions/{id}/cancel"] = true
	o.Handlers["DELETE"]["/api/v1/channels/{id}"] = true
	o.Handlers["DELETE"]["/api/v1/faqs/{id}"] = true
	o.Handlers["DELETE"]["/api/v1/featured-sections/{id}"] = true
	o.Handlers["DELETE"]["/api/v1/feedbacks/{id}"] = true
	o.Handlers["DELETE"]["/api/v1/streams/{id}"] = true
	o.Handlers["DELETE"]["/api/v1/tv-shows/{id}"] = true
	o.Handlers["DELETE"]["/api/v1/tags/{id}"] = true
	o.Handlers["GET"]["/api/v1/subscriptions/active"] = true
	o.Handlers["GET"]["/api/v1/articles"] = true
	o.Handlers["GET"]["/api/v1/featured-sections"] = true
	o.Handlers["GET"]["/api/v1/tv-shows"] = true
	o.Handlers["GET"]["/api/v1/tv-shows/schedules"] = true
	o.Handlers["GET"]["/api/v1/apps"] = true
	o.Handlers["GET"]["/api/v1/apps/{id}"] = true
	o.Handlers["GET"]["/api/v1/articles/{id}"] = true
	o.Handlers["GET"]["/api/v1/channels"] = true
	o.Handlers["GET"]["/api/v1/channels/{id}"] = true
	o.Handlers["GET"]["/api/v1/faqs"] = true
	o.Handlers["GET"]["/api/v1/faqs/{id}"] = true
	o.Handlers["GET"]["/api/v1/featured-sections/{id}"] = true
	o.Handlers["GET"]["/api/v1/featured-sections/{id}/articles"] = true
	o.Handlers["GET"]["/api/v1/featured-sections/articles"] = true
	o.Handlers["GET"]["/api/v1/feedbacks"] = true
	o.Handlers["GET"]["/api/v1/feedbacks/{id}"] = true
	o.Handlers["GET"]["/api/v1/streams/forward/secrets"] = true
	o.Handlers["GET"]["/api/v1/streams/forward/streams"] = true
	o.Handlers["GET"]["/api/v1/healthy"] = true
	o.Handlers["GET"]["/api/v1/subscriptions/plans/{id}"] = true
	o.Handlers["GET"]["/api/v1/subscriptions/plans"] = true
	o.Handlers["GET"]["/api/v1/push/test"] = true
	o.Handlers["GET"]["/api/v1/streams/{id}/reset-password"] = true
	o.Handlers["GET"]["/api/v1/streams"] = true
	o.Handlers["GET"]["/api/v1/streams/{id}"] = true
	o.Handlers["GET"]["/api/v1/streams/{id}/ws"] = true
	o.Handlers["GET"]["/api/v1/subscriptions"] = true
	o.Handlers["GET"]["/swagger.yml"] = true
	o.Handlers["GET"]["/api/v1/tv-shows/{id}"] = true
	o.Handlers["GET"]["/api/v1/tv-shows/{id}/schedules"] = true
	o.Handlers["GET"]["/api/v1/tags/{id}"] = true
	o.Handlers["GET"]["/api/v1/tags/{id}/articles"] = true
	o.Handlers["GET"]["/api/v1/tags/articles"] = true
	o.Handlers["GET"]["/api/v1/tags"] = true
	o.Handlers["GET"]["/api/v1/auth/userinfo"] = true
	o.Handlers["GET"]["/api/v1/subscriptions/transactions"] = true
	o.Handlers["GET"]["/api/v1/streams/vlive/secrets"] = true
	o.Handlers["GET"]["/api/v1/streams/vlive/streams"] = true
	o.Handlers["GET"]["/api/v1/version"] = true
	o.Handlers["POST"]["/api/v1/apps"] = true
	o.Handlers["POST"]["/api/v1/auth/change-password"] = true
	o.Handlers["POST"]["/api/v1/channels"] = true
	o.Handlers["POST"]["/api/v1/articles"] = true
	o.Handlers["POST"]["/api/v1/featured-sections"] = true
	o.Handlers["POST"]["/api/v1/tv-shows"] = true
	o.Handlers["POST"]["/api/v1/tags"] = true
	o.Handlers["POST"]["/api/v1/faqs"] = true
	o.Handlers["POST"]["/api/v1/feedbacks"] = true
	o.Handlers["POST"]["/api/v1/auth/forgot-password/complete"] = true
	o.Handlers["POST"]["/api/v1/auth/forgot-password"] = true
	o.Handlers["POST"]["/api/v1/streams/forward/secrets"] = true
	o.Handlers["POST"]["/api/v1/auth/login"] = true
	o.Handlers["POST"]["/api/v1/subscriptions/plans"] = true
	o.Handlers["POST"]["/api/v1/push/send"] = true
	o.Handlers["POST"]["/api/v1/auth/refresh"] = true
	o.Handlers["POST"]["/api/v1/auth/register"] = true
	o.Handlers["POST"]["/api/v1/subscriptions/{id}/renew"] = true
	o.Handlers["POST"]["/api/v1/subscriptions/{id}/resubscribe"] = true
	o.Handlers["POST"]["/api/v1/streams/events"] = true
	o.Handlers["POST"]["/api/v1/streams"] = true
	o.Handlers["POST"]["/api/v1/subscriptions/subscribe"] = true
	o.Handlers["POST"]["/api/v1/push/token"] = true
	o.Handlers["POST"]["/api/v1/subscriptions/upgrade"] = true
	o.Handlers["POST"]["/api/v1/streams/vlive/secrets"] = true
	o.Handlers["POST"]["/api/v1/streams/vlive/source"] = true
	o.Handlers["POST"]["/api/v1/streams/vlive/stream-url"] = true
	o.Handlers["PUT"]["/api/v1/apps/{id}"] = true
	o.Handlers["PUT"]["/api/v1/channels/{id}"] = true
	o.Handlers["PUT"]["/api/v1/faqs/{id}"] = true
	o.Handlers["PUT"]["/api/v1/feedbacks/{id}"] = true
	o.Handlers["PUT"]["/api/v1/streams/{id}/name"] = true
	o.Handlers["PUT"]["/api/v1/streams/{id}"] = true
	o.Handlers["PUT"]["/api/v1/auth/userinfo"] = true
	o.Handlers["PUT"]["/api/v1/articles/{id}"] = true
	o.Handlers["PUT"]["/api/v1/featured-sections/{id}/articles"] = true
	o.Handlers["PUT"]["/api/v1/featured-sections/{id}"] = true
	o.Handlers["PUT"]["/api/v1/tv-shows/{id}"] = true
	o.Handlers["PUT"]["/api/v1/tv-shows/{id}/schedules"] = true
	o.Handlers["PUT"]["/api/v1/tags/{id}"] = true
	o.Handlers["POST"]["/api/v1/upload/image"] = true
}
