//go:build scripts

package util

import "os"

func GetProjectRootDir() string {

	if val, ok := os.LookupEnv("PROJECT_ROOT_DIR"); ok {
		return val
	}
	// docker
	// return "/app"

	// local
	return "C:\\Users\\admin\\Desktop\\projects\\go\\rustion"
}
