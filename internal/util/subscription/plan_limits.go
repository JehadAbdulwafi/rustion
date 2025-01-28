package subscription

// PlanLimits defines the limits for each subscription plan
type PlanLimits struct {
	MaxStreamingMinutesPerDay int64
	MaxStorageBytes          int64
	MaxPlatformConnections   int
}

var (
	// StarterPlanLimits defines limits for the Starter plan
	StarterPlanLimits = PlanLimits{
		MaxStreamingMinutesPerDay: 180,  // 3 hours
		MaxStorageBytes:          5368709120, // 5GB in bytes
		MaxPlatformConnections:   2,
	}

	// ProPlanLimits defines limits for the Pro plan
	ProPlanLimits = PlanLimits{
		MaxStreamingMinutesPerDay: 720,  // 12 hours
		MaxStorageBytes:          -1,    // Unlimited
		MaxPlatformConnections:   5,
	}

	// AdvancedPlanLimits defines limits for the Advanced plan
	AdvancedPlanLimits = PlanLimits{
		MaxStreamingMinutesPerDay: -1,    // Unlimited
		MaxStorageBytes:          -1,    // Unlimited
		MaxPlatformConnections:   -1,    // Unlimited
	}

	// PlanLimitsMap maps plan IDs to their respective limits
	PlanLimitsMap = map[string]PlanLimits{
		"starter":   StarterPlanLimits,
		"pro":      ProPlanLimits,
		"advanced": AdvancedPlanLimits,
	}
)

// GetPlanLimits returns the limits for a given plan ID
func GetPlanLimits(planID string) PlanLimits {
	if limits, ok := PlanLimitsMap[planID]; ok {
		return limits
	}
	return StarterPlanLimits // Default to starter plan limits
}