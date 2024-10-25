package config

import "fmt"

var (
	ModuleName = "build.local/misses/ldflags"               // e.g. "github.com/JehadAbdulwafi/rustion"
	Commit     = "< 40 chars git commit hash via ldflags >" // e.g. "59cb7684dd0b0f38d68cd7db657cb614feba8f7e"
	BuildDate  = "1970-01-01T00:00:00+00:00"                // e.g. "1970-01-01T00:00:00+00:00"
)

// GetFormattedBuildArgs returns string representation of buildsargs set via ldflags "<ModuleName> @ <Commit> (<BuildDate>)"
func GetFormattedBuildArgs() string {
	return fmt.Sprintf("%v @ %v (%v)", ModuleName, Commit, BuildDate)
}
