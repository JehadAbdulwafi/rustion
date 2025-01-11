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
		if err := os.MkdirAll(assetsDir, 0777); err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("Failed to create assets directory: %v", err))
		}

		// Debug: Print current working directory and directory info
		cwd, _ := os.Getwd()
		fmt.Printf("Debug - Current working directory: %s\n", cwd)
		fmt.Printf("Debug - Trying to write to directory: %s\n", assetsDir)

		// Test write permissions with a temp file
		testFile := filepath.Join(assetsDir, "test.txt")
		if err := os.WriteFile(testFile, []byte("test"), 0666); err != nil {
			fmt.Printf("Debug - Write test failed: %v\n", err)
		} else {
			os.Remove(testFile) // Clean up test file
			fmt.Printf("Debug - Write test succeeded\n")
		}

		if info, err := os.Stat(assetsDir); err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("Failed to stat assets directory: %v", err))
		} else {
			perm := info.Mode().Perm()
			fmt.Printf("Debug - Directory permissions: %v\n", perm)
			fmt.Printf("Debug - Directory owner: %v\n", info.Sys())
		}

		// Create the destination file with explicit permissions
		fullPath := filepath.Join(assetsDir, filename)
		fmt.Printf("Debug - Creating file at: %s\n", fullPath)
		
		dst, err := os.OpenFile(
			fullPath,
			os.O_CREATE|os.O_WRONLY,
			0666,
		)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, fmt.Sprintf("Failed to create destination file: %v (path: %s)", err, fullPath))
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
