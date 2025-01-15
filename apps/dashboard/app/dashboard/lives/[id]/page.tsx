import { getLiveStream } from "@/api/LiveApi";
import LiveScene from "./components/live-scene";
import { getUser, verifySession } from "@/lib/dal";
import { getChannels } from "@/api/ChannelApi";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params
  const stream = await getLiveStream(id);
  const channels = await getChannels();
  const user = await verifySession();

  return (
    <LiveScene stream={stream} channels={channels} userID={user.userID!} />
  );
}
