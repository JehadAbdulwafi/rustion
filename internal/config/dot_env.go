package config

import (
	"errors"
	"os"

	"github.com/rs/zerolog/log"
	"github.com/subosito/gotenv"
)

// os.SetEnv func signature
type envSetter = func(key string, value string) error

// DotEnvTryLoad forcefully overrides ENV variables through **a maybe available** .env file.
func DotEnvTryLoad(absolutePathToEnvFile string, setEnvFn envSetter) {
	err := DotEnvLoad(absolutePathToEnvFile, setEnvFn)

	if err != nil {
		if !errors.Is(err, os.ErrNotExist) {
			log.Panic().Err(err).Str("envFile", absolutePathToEnvFile).Msg(".env parse error!")
		}
	} else {
		log.Warn().Str("envFile", absolutePathToEnvFile).Msg(".env overrides ENV variables!")
	}
}

// DotEnvLoad forcefully overrides ENV variables through the supplied .env file.
func DotEnvLoad(absolutePathToEnvFile string, setEnvFn envSetter) error {

	file, err := os.Open(absolutePathToEnvFile)

	if err != nil {
		return err
	}

	defer file.Close()

	envs, err := gotenv.StrictParse(file)

	if err != nil {
		return err
	}

	for key, value := range envs {
		if err := setEnvFn(key, value); err != nil {
			return err
		}
	}

	return nil
}
