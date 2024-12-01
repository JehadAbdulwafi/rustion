import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { CopyButton, ResetButton } from './copy-button'
import { Eye, EyeOff, RefreshCw } from 'lucide-react'
import { resetStreamPassword } from '@/api/LiveApi'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'

const generateRtmpUrl = (stream: Stream) => {
  return `rtmp://${stream.host || 'localhost'}/${stream.app || ''}`;
};

const generateRtmpPassword = (stream: Stream) => {
  return `/${stream.name}?secret=${stream.secret}&password=${stream.password}`;
};

const generateSrtUrl = (stream: Stream) => {
  return `srt://${stream.host || 'localhost:10800'}?streamid=#!::r=${stream.app}/${stream.name}?secret=${stream.secret}&password=${stream.password},m=publish`;
};

export default function SourceSetup({ stream }: { stream: Stream }) {
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async () => {
    try {
      setIsResetting(true);
      await resetStreamPassword(stream.id);
      toast({
        title: "Success",
        description: "Stream password has been reset",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset stream password",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card className="flex flex-1 flex-col pb-0 mb-0">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Source Setup</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col py-4">
        <Tabs defaultValue="RTMP">
          <TabsList className='w-full'>
            <TabsTrigger value="RTMP" className='flex flex-1'>RTMP</TabsTrigger>
            <TabsTrigger value="SRT" className='flex flex-1'>SRT</TabsTrigger>
          </TabsList>
          <TabsContent value="RTMP" className='flex flex-col gap-3'>
            <Label className='mt-4'>Stream URL</Label>
            <div className="flex flex-1 flex-row gap-2 items-center">
              <Input
                className="w-full disabled:cursor-text disabled:text-current"
                value={generateRtmpUrl(stream)}
                disabled
              />
              <CopyButton content={generateRtmpUrl(stream)} placeholder="Copy Stream URL" />
            </div>
            <Label>Stream Key</Label>
            <div className="flex flex-1 flex-row gap-2 items-center">
              <div className='flex flex-1 relative'>
                <Input
                  disabled
                  type={showStreamKey ? "text" : "password"}
                  className="w-full disabled:cursor-text disabled:text-current pr-10"
                  value={generateRtmpPassword(stream)}
                />
                <button
                  onClick={() => setShowStreamKey(!showStreamKey)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-md"
                  type="button"
                >
                  {showStreamKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <ResetButton handleClick={handleResetPassword} isResetting={isResetting} placeholder="Reset Stream Password" />
              <CopyButton content={generateRtmpPassword(stream)} placeholder="Copy Stream Key" />
            </div>
          </TabsContent>
          <TabsContent value="SRT" className='flex flex-col gap-3'>
            <Label className='mt-2'>Stream URL</Label>
            <div className="flex flex-1 flex-row gap-2 items-center">
              <Input
                className="w-full disabled:cursor-text disabled:text-current"
                value={generateSrtUrl(stream)}
                disabled
              />
              <CopyButton content={generateSrtUrl(stream)} placeholder="Copy Stream URL" />
            </div>

            <Label>Stream Key</Label>
            <div className="flex flex-1 flex-row gap-2 items-center">
              <div className='flex flex-1'>
                <Input
                  disabled
                  className="w-full disabled:cursor-text disabled:text-primary"
                  placeholder='Please leave it empty'
                  value={'Please leave it empty'}
                />
              </div>
              <ResetButton handleClick={handleResetPassword} isResetting={isResetting} placeholder="Reset Stream Password" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
