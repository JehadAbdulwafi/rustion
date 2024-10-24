//go:build scripts

package util

import "os"

// GetProjectRootDir returns the path as string to the project_root while **scripts generation**.
func GetProjectRootDir() string {
	if val, ok := os.LookupEnv("PROJECT_ROOT_DIR"); ok {
		return val
	}

	return "/app"
}
