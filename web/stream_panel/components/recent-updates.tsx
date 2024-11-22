import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ScrollArea } from './ui/scroll-area'

export default function RecentUpdates() {
  return (
    <Card className="flex flex-1 flex-col pb-0 mb-0">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Recent Updates</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 m-0">
        <ScrollArea className="flex flex-col px-2 max-h-[520px] sm:px-6">
          <div className="w-full min-h-16 rounded-xl mb-4 mt-4 bg-muted/70" />
          <div className="w-full min-h-16 rounded-xl mb-4 bg-muted/70" />
          <div className="w-full min-h-16 rounded-xl mb-4 bg-muted/70" />
          <div className="w-full min-h-16 rounded-xl mb-4 bg-muted/70" />
          <div className="w-full min-h-16 rounded-xl mb-4 bg-muted/70" />
          <div className="w-full min-h-16 rounded-xl mb-4 bg-muted/70" />
          <div className="w-full min-h-16 rounded-xl mb-4 bg-muted/70" />
          <div className="w-full min-h-16 rounded-xl mb-4 bg-muted/70" />
          <div className="w-full min-h-16 rounded-xl mb-4 bg-muted/70" />
          <div className="w-full min-h-16 rounded-xl mb-4 bg-muted/70" />
          <div className="w-full min-h-16 rounded-xl mb-4 bg-muted/70" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

