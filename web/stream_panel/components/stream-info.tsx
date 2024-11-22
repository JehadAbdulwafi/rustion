import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'

export default function StreamInfo() {
  return (
    <Card className="flex flex-1 flex-col pb-0 mb-0">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Stream Info</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Label className='mt-4'>Title</Label>
        <Input
          className="w-full"
          placeholder='Enter title'
        />
        <Label>Description</Label>
        <Input
          className="w-full"
          placeholder='Enter description'
        />
        <CardFooter className="flex justify-end p-0">
          <Button>Save</Button>
        </CardFooter>
      </CardContent>
    </Card>
  )
}

