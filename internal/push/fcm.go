package push

import (
	"context"
	"errors"

	"github.com/JehadAbdulwafi/rustion/internal/util"
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

func (p *FCM) Send(token string, title string, message string, image string) ProviderSendResponse {
	ctx := context.Background()
	log := util.LogFromContext(ctx)
	log.Debug().Str("token", token).Str("title", title).Str("message", message).Str("image", image).Msg("Sending push notification to FCM.")
	messageRequest := &fcm.SendMessageRequest{
		ValidateOnly: p.Config.ValidateOnly,
		Message: &fcm.Message{
			Token: token,
			Notification: &fcm.Notification{
				Title: title,
				Body:  message,
				Image: image,
			},
			Android: &fcm.AndroidConfig{
				Priority: "high",
				Notification: &fcm.AndroidNotification{
					DefaultSound: true,
				},
			},
		},
	}

	res, err := p.service.Projects.Messages.Send("projects/"+p.Config.ProjectID, messageRequest).Do()
	valid := true
	if err != nil {
		log.Error().Err(err).Str("token", token).Msg("Failed to send FCM message")
		// convert to original error and determine if the token was at fault
		var gErr *googleapi.Error
		if errors.As(err, &gErr) {
			switch gErr.Code {
			case 404, // Not Found
				400, // Bad Request
				403: // Forbidden
				valid = false
				log.Error().
					Int("error_code", gErr.Code).
					Str("token", token).
					Msg("FCM token is invalid or expired")
			default:
				log.Error().
					Int("error_code", gErr.Code).
					Str("token", token).
					Msg("Unknown FCM error occurred")
			}
		}
	} else {
		log.Debug().Str("message_id", res.Name).Str("token", token).Msg("Successfully sent FCM message")
	}

	return ProviderSendResponse{
		Token: token,
		Valid: valid,
		Err:   err,
	}
}

func (p *FCM) SendMulticast(tokens []string, title, message string, image string) []ProviderSendResponse {
	responseSlice := make([]ProviderSendResponse, 0)

	for _, token := range tokens {
		responseSlice = append(responseSlice, p.Send(token, title, message, image))
	}

	return responseSlice
}
