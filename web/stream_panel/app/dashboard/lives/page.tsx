import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Podcast } from 'lucide-react'
import React from 'react'

export default function page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 className="text-3xl font-bold">Channels</h1>
        <p className="text-sm text-muted-foreground">View all of the channels you're part of in one place</p>
      </div>
      <Card className="w-full aspect-video max-h-96 pb-0 mb-0">
        <CardContent className="flex flex-1 flex-col h-full w-full gap-4 items-center justify-center">
          <Podcast className="h-16 w-16" />
          <div className="text-center">
            <h4 className="text-2xl font-bold">No Channels</h4>
            <p className="text-sm text-muted-foreground">
              Channels will appear here once you've created them
            </p>
          </div>

          <Button className="font-medium">
            Create Channel
            <ArrowRight className="h-4 w-4" />
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}
