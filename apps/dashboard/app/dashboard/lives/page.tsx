import { getLiveStreams } from "@/api/LiveApi";
import { catchErrorTyped } from '@/api/ApiError';
import LivesScene from './components/lives-scene';

export default async function LivesPage() {
  const [err, fetchedLives] = await catchErrorTyped(getLiveStreams());

  if (err !== undefined) {
    return <div className="flex flex-1 items-center justify-center">Error: {err.message}</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Streams</h1>
        <p className="text-sm text-muted-foreground">View all of the lives you're part of in one place</p>
      </div>

      <LivesScene lives={fetchedLives} />
    </div>
  );
}
