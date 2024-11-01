package push

import (
	"context"
	"errors"
	"net/http"

	"google.golang.org/api/fcm/v1"
	"google.golang.org/api/googleapi"
	"google.golang.org/api/option"
)

type FCM struct {
	Config  FCMConfig
	service *fcm.Service
}

type FCMConfig struct {
	GoogleApplicationCredentials string `json:"-"`
	ProjectID                    string
	ValidateOnly                 bool
}

func NewFCM(config FCMConfig, opts ...option.ClientOption) (*FCM, error) {
	ctx := context.Background()
	fcmService, err := fcm.NewService(ctx, opts...)
	if err != nil {
		return nil, err
	}

	return &FCM{
		Config:  config,
		service: fcmService,
	}, nil
}

func (p *FCM) GetProviderType() ProviderType {
	return ProviderTypeFCM
}

func (p *FCM) Send(token string, title string, message string) ProviderSendResponse {
	messageRequest := &fcm.SendMessageRequest{
		ValidateOnly: p.Config.ValidateOnly,
		Message: &fcm.Message{
			Token: token,
			Notification: &fcm.Notification{
				Title: title,
				Body:  message,
			},
		},
	}

	_, err := p.service.Projects.Messages.Send("projects/"+p.Config.ProjectID, messageRequest).Do()
	valid := true
	if err != nil {

		// convert to original error and determine if the token was at fault
		var gErr *googleapi.Error
		if errors.As(err, &gErr) {
			valid = !(gErr.Code == http.StatusNotFound || gErr.Code == http.StatusBadRequest)
		}
	}

	return ProviderSendResponse{
		Token: token,
		Valid: valid,
		Err:   err,
	}
}

func (p *FCM) SendMulticast(tokens []string, title, message string) []ProviderSendResponse {
	responseSlice := make([]ProviderSendResponse, 0)

	for _, token := range tokens {
		responseSlice = append(responseSlice, p.Send(token, title, message))
	}

	return responseSlice
}
