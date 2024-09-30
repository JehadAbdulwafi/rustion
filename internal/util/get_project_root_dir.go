//go:build !scripts

package util

import (
	"os"
	"path/filepath"
	"sync"

	"github.com/rs/zerolog/log"
)

var (
	projectRootDir string
	dirOnce        sync.Once
)

// GetProjectRootDir returns the path as string to the project_root for a **running application**.
func GetProjectRootDir() string {
	dirOnce.Do(func() {
		ex, err := os.Executable()
		if err != nil {
			log.Panic().Err(err).Msg("Failed to get executable path while retrieving project root directory")
		}

		projectRootDir = GetEnv("PROJECT_ROOT_DIR", filepath.Dir(ex))
	})

	return projectRootDir
}
