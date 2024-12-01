import { Podcast } from 'lucide-react'
import { getLives } from "@/api/LiveApi";
import { EmptyStateCard } from '@/components/empty-state-card';
import StreamCard from '@/components/stream-card';




export default async function page() {
  const lives = await getLives();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Streams</h1>
        <p className="text-sm text-muted-foreground">View all of the lives you're part of in one place</p>
      </div>
      {lives.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {lives.map((live) => (
            <StreamCard key={live.id} live={live} />
          ))}
        </div>
      ) : (
        <EmptyStateCard
          title="No lives"
          description="Lives will appear here once you've created them."
          icon={Podcast}
          actionLabel='Create Live'
          onActionClick={() => console.log('hello')}
        />
      )}
    </div>
  )
}
