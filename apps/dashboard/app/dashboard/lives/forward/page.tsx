"use client";

import Forward from "@/components/forward";

export default function page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Forwarding Streams</h1>
        <p className="text-sm text-muted-foreground">
          Multi-platform streaming, forward to other platforms, such as YouTube, Twitch, Facebook, etc.
        </p>
      </div>
      <Forward />
    </div>
  )
}

