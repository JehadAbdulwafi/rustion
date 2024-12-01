import { getLive } from "@/api/LiveApi";
import LiveScene from "./components/live-scene";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params
  const stream = await getLive(id);

  return (
    <LiveScene stream={stream} />
  );
}