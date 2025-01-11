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

		// Use absolute path for assets directory
		assetsDir := "/app/assets/images"
		if err := os.MkdirAll(assetsDir, 0755); err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("Failed to create assets directory: %v", err))
		}

		// Debug: Print current working directory and directory info
		cwd, _ := os.Getwd()
		fmt.Printf("Current working directory: %s\n", cwd)
		if info, err := os.Stat(assetsDir); err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("Failed to stat assets directory: %v", err))
		} else {
			perm := info.Mode().Perm()
			fmt.Printf("Directory permissions: %v\n", perm)
			fmt.Printf("Directory owner: %v\n", info.Sys())
			if perm&0200 == 0 { // Check if directory is writable
				return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("Assets directory is not writable. Current permissions: %v", perm))
			}
		}

		// Create the destination file with explicit permissions
		dst, err := os.OpenFile(
			filepath.Join(assetsDir, filename),
			os.O_CREATE|os.O_WRONLY,
			0666,
		)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("Failed to create destination file: %v", err))
		}
		defer dst.Close()

		// Copy the uploaded file to the destination
		if _, err = file.Seek(0, 0); err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to seek file")
		}

		buffer := make([]byte, 1024*1024) // 1MB buffer
		for {
			n, err := file.Read(buffer)
			if err != nil {
				if err.Error() == "EOF" {
					break
				}
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to read file")
			}

			if _, err := dst.Write(buffer[:n]); err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to write file")
			}
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
