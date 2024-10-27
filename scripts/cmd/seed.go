//go:build scripts

package cmd

import (
	"log"

	"github.com/spf13/cobra"
	"github.com/JehadAbdulwafi/rustion/scripts/internal/seed"
)

var seedCmd = &cobra.Command{
	Use:   "seed",
	Short: "Seeds the database with initial data.",
	Long:  `Inserts seed data into the database for initial setup.`,
	Run: func(cmd *cobra.Command, _ []string /* args */) {
		if err := seed.InsertSeedData(); err != nil {
			log.Fatalf("Failed to seed data: %v", err)
		}
	},
}

func init() {
	rootCmd.AddCommand(seedCmd)
}
