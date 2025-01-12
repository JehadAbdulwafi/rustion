package common

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/JehadAbdulwafi/rustion/internal/api"
	"github.com/JehadAbdulwafi/rustion/internal/api/auth"
	"github.com/JehadAbdulwafi/rustion/internal/types"
	"github.com/JehadAbdulwafi/rustion/internal/util"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

func postUploadImageHandler(s *api.Server) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx := c.Request().Context()
		_ = auth.UserFromContext(ctx)

		// Parse the multipart form file
		fileHeader, file, _, err := util.ParseFileUpload(c, "image", []string{
			"image/jpeg",
			"image/png",
			"image/gif",
			"image/webp",
		})
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Failed to parse image upload")
		}
		defer file.Close()

		// Generate a unique filename
		filename := uuid.New().String() + filepath.Ext(fileHeader.Filename)

		// Create an uploads directory if it doesn’t exist
		assetsDir := "/app/assets/images"
		if _, err := os.Stat(assetsDir); os.IsNotExist(err) {
			err = os.Mkdir(assetsDir, 0755)
			if err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create assets directory")
			}
		}

		// Create the destination file
		dst, err := os.Create(filepath.Join(assetsDir, filename))
		if err != nil {
			log.Error().Err(err).Msg("Failed to create destination file")
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create destination file")
		}
		defer dst.Close()

		// Copy the uploaded file to the destination file
		if _, err := dst.ReadFrom(file); err != nil {
			log.Error().Err(err).Msg("Failed to copy uploaded file")
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to save file")
		}

		// Generate the URL for the uploaded image
		baseURL := s.Config.Echo.BaseURL
		imageURL := fmt.Sprintf("%s/assets/images/%s", baseURL, filename)

		response := types.ImageUploadResponse{
			URL:      &imageURL,
			Filename: &filename,
		}

		return util.ValidateAndReturn(c, http.StatusOK, &response)
	}
}

// PostUploadImageRoute adds the upload image route to the server
func PostUploadImageRoute(s *api.Server) *echo.Route {
	return s.Router.Root.POST("/upload/image", postUploadImageHandler(s))
}
