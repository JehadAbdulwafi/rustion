import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

export default function GettingStarted() {
  return (
    <>
      <Card className="w-full flex flex-col pb-0 mb-0">
        <CardHeader className="space-y-0 p-0">
          <CardTitle className="px-6 py-5 sm:py-6">
            Start your first stream in seconds with rustion now!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 mt-auto">
          <Button className="font-medium">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full flex flex-col pb-0 mb-0">
        <CardHeader className="space-y-0 p-0">
          <CardTitle className="px-6 py-5 sm:py-6">
            Create a universal Android, iOS, and web app
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 mt-auto">
          <Button className="font-medium">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

