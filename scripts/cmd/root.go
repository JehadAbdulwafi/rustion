//go:build scripts

package cmd

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/JehadAbdulwafi/rustion/scripts/internal/util"
	"github.com/spf13/cobra"
)

var (
	projectRoot = util.GetProjectRootDir()
	modulePath  = filepath.Join(util.GetProjectRootDir(), "go.mod")
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "rsdev",
	Short: "rsdev",
	Long:  `rustion development scripts Utility commands`,
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
