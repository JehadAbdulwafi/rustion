"use client"
import SourceSetup from '@/components/source-setup';
import StatsCard from '@/components/stats-card';
import StreamInfo from '@/components/stream-info';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react'

export default function page() {
  const { id } = useParams<{ id: string }>()
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center mt-4 gap-2">
        <ArrowLeft className='w-6 h-6' />
        <h3 className="text-3xl capitalize">{id}</h3>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 col-span-1 lg:col-span-2 auto-rows-min">
          <div className="w-full aspect-video col-span-1 sm:col-span-3 rounded-xl bg-black">
            <video
              src="http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
              className="w-full h-full"
              controls
              controlsList="nodownload"
              disableRemotePlayback
            />
          </div>

          <div className="w-full col-span-1 md:col-span-3 lg:col-span-1">
            <StatsCard title='Connection' value={'Off Air'} />
          </div>

          <div className="w-full col-span-1 md:col-span-3 lg:col-span-1">
            <StatsCard title='Total Viewers' value={100} />
          </div>

          <div className="w-full col-span-1 md:col-span-3 lg:col-span-1">
            <StatsCard title='Stream Time' value={'2.4 hrs'} />
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <SourceSetup />
          <StreamInfo />
        </div>
      </div>
    </div>
  )
}

