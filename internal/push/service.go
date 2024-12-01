package push

import (
	"context"
	"errors"

	"github.com/JehadAbdulwafi/rustion/internal/database"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
)

type ProviderType string

const (
	ProviderTypeFCM ProviderType = "fcm"
	ProviderTypeAPN ProviderType = "apn"
)

type Service struct {
	Queries  *database.Queries
	provider map[ProviderType]Provider
}

type ProviderSendResponse struct {
	// token the message was sent to
	Token string

	// flag to indicate if the token is still valid
	// not every error means that the token is invalid
	Valid bool

	// ogiginal error
	Err error
}

type Provider interface {
	Send(token string, title string, message string, image string) ProviderSendResponse
	SendMulticast(tokens []string, title, message string, image string) []ProviderSendResponse
	GetProviderType() ProviderType
}

func New(db *database.Queries) *Service {
	return &Service{
		Queries:  db,
		provider: make(map[ProviderType]Provider),
	}
}

func (s *Service) RegisterProvider(p Provider) {
	s.provider[p.GetProviderType()] = p
}

func (s *Service) ResetProviders() {
	s.provider = make(map[ProviderType]Provider)
}

func (s *Service) GetProviderCount() int {
	return len(s.provider)
}

func (s *Service) SendToUsers(ctx context.Context, appID uuid.UUID, title string, message string, image string) error {
	if s.GetProviderCount() < 1 {
		return errors.New("No provider found")
	}
	log := util.LogFromContext(ctx)

	for _, p := range s.provider {
		// get all registered tokens for provider
		pushTokens, err := s.Queries.GetPushTokenesByAppID(ctx, uuid.NullUUID{UUID: appID, Valid: true})
		if err != nil {
			return err
		}

		var tokens []string
		for _, token := range pushTokens {
			tokens = append(tokens, token.Token)
		}

		responseSlice := p.SendMulticast(tokens, title, message, image)
		tokenToDelete := make([]string, 0)
		for _, res := range responseSlice {
			if res.Err != nil && res.Valid {
				log.Debug().Err(res.Err).Str("token", res.Token).Str("provider", string(p.GetProviderType())).Msgf("Error while sending push message to provider with valid token.")
			}

			if !res.Valid {
				tokenToDelete = append(tokenToDelete, res.Token)
			}
		}

		for _, token := range tokenToDelete {
			err = s.Queries.DeletePushToken(ctx, token)

			if err != nil {
				log.Debug().Err(err).Str("provider", string(p.GetProviderType())).Msg("Could not delete invalid tokens for provider")
				return err
			}
		}

	}

	return nil
}
