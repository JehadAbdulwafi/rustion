import { getAppIdSession } from "@/actions";
import { API } from "./axios";
import { ApiError } from "./ApiError";

async function getChannels(): Promise<Channel[]> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<Channel[]>(`channels`);
    return res.data
  } catch (error) {
    console.log(`CHANNELS_API GET_CHANNELS: ERR:`, error)
    throw new ApiError("FAILED TO GET CHANNELS")
  }
}

export {
    getChannels
}