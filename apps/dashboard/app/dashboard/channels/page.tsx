import { getChannels } from "@/api/ChannelApi";
import ChannelsScene from "./components/channels-scene";

export default async function page() {
  const channels = await getChannels();

  return (
    <ChannelsScene channels={channels} />
  )
}

