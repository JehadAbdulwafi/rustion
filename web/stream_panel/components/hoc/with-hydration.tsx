"use client"

import { HydrationProvider } from "../providers/hydration-provider"

export function withHydration<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithHydrationComponent(props: P) {
    return (
      <HydrationProvider>
        <WrappedComponent {...props} />
      </HydrationProvider>
    )
  }
}
