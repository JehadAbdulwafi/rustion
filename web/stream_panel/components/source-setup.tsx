import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { CopyButton } from './copy-button'

export default function SourceSetup() {
  return (
    <Card className="flex flex-1 flex-col pb-0 mb-0">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Source Setup</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col py-4">
        <Tabs defaultValue="RTMP">
          <TabsList className=' w-full'>
            <TabsTrigger value="RTMP" className='flex flex-1'>RTMP</TabsTrigger>
            <TabsTrigger value="SRT" className='flex flex-1'>SRT</TabsTrigger>
            <TabsTrigger value="WHIP" className='flex flex-1'>WHIP</TabsTrigger>
          </TabsList>
          <TabsContent value="RTMP" className='flex flex-col gap-3'>
            <Label className='mt-4'>Stream URL</Label>
            <div className="flex flex-1 flex-row gap-2 items-center">
              <Input
                className="w-full disabled:cursor-text disabled:text-current"
                value={"rtmp://southafrica.castr.io/static"}
                disabled
                onClick={(e) => navigator.clipboard.writeText(e.currentTarget.value)}
              />
              <CopyButton content={"rtmp://southafrica.castr.io/static"} placeholder="Copy Stream Key" />
            </div>
            <Label>Stream Key</Label>
            <div className="flex flex-1 flex-row gap-2 items-center">
              <div className='flex flex-1'>
                <Input
                  disabled
                  type="password"
                  className="w-full disabled:cursor-text disabled:text-current"
                  value={"secret_jey"}
                  onClick={(e) => navigator.clipboard.writeText(e.currentTarget.value)}
                />
              </div>
              <CopyButton content={"key"} placeholder="Copy Stream Key" />
            </div>
          </TabsContent>
          <TabsContent value="SRT" className='flex flex-col gap-3'>
            <Label className='mt-2'>Stream URL</Label>
            <div className="flex flex-1 flex-row gap-2 items-center">
              <Input
                className="w-full disabled:cursor-text disabled:text-current"
                value={"rtmp://southafrica.castr.io/static"}
                disabled
                onClick={(e) => navigator.clipboard.writeText(e.currentTarget.value)}
              />
              <CopyButton content={"rtmp://southafrica.castr.io/static"} placeholder="Copy Stream Key" />
            </div>
          </TabsContent>

          <TabsContent value="WHIP" className='flex flex-col gap-3'>
            <Label className=''>Stream URL</Label>
            <div className="flex flex-1 flex-row gap-2 items-center">
              <Input
                className="w-full disabled:cursor-text disabled:text-current"
                value={"rtmp://southafrica.castr.io/static"}
                disabled
                onClick={(e) => navigator.clipboard.writeText(e.currentTarget.value)}
              />
              <CopyButton content={"rtmp://southafrica.castr.io/static"} placeholder="Copy Stream Key" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

