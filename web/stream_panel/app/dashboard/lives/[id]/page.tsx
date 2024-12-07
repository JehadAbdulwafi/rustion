import { getLiveStream } from "@/api/LiveApi";
import LiveScene from "./components/live-scene";
import { getUser, verifySession } from "@/lib/dal";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params
  const stream = await getLiveStream(id);
  const user = await verifySession();

  return (
    <LiveScene stream={stream} userID={user.userID!} />
  );
}
