import { getAppIdSession } from "@/actions";
import { API } from "./axios";
import { FieldValues } from "react-hook-form";
import { ApiError } from "./ApiError";

async function getLiveStream(id: string): Promise<Stream> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<Stream>(`streams/${id}`, { params: { app_id: appId } });
    return res.data
  } catch (error) {
    console.log(`LIVES_API GET_LIVE ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO GET LIVESTREAM")
  }
}

async function getLiveStreams(): Promise<Stream[]> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<Stream[]>('streams', { params: { app_id: appId } });
    return res.data
  } catch (error) {
    console.log(`LIVES_API GET_LIVES, ERR: ${error}`)
    throw new ApiError("FAILED TO GET LIVESTREAMS")
  }
}

async function resetStreamPassword(id: string): Promise<Stream> {
  try {
    const res = await API.get<Stream>(`streams/${id}/reset-password`);
    return res.data;
  } catch (error) {
    console.log(`LIVES_API RESET_STREAM_PASSWORD ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO RESET LIVESTREAM PASSWORD")
  }
}

async function updateStream(id: string, data: FieldValues): Promise<Stream> {
  try {
    const res = await API.put<Stream>(`streams/${id}`, { ...data });
    return res.data;
  } catch (error) {
    console.log(`LIVES_API UPDATE_STREAM ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO UPDATE LIVESTREAM")
  }
}

async function updateStreamName(id: string, data: Partial<Stream>): Promise<Stream> {
  try {
    const res = await API.put<Stream>(`streams/${id}/name`, { ...data });
    return res.data;
  } catch (error) {
    console.log(`LIVES_API UPDATE_STREAM_NAME ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO UPDATE LIVESTREAM NAME")
  }
}

async function deleteStream(id: string): Promise<void> {
  try {
    await API.delete(`streams/${id}`);
  } catch (error) {
    console.log(`LIVES_API DELETE_STREAM ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO DELETE LIVESTREAM")
  }
}

async function createStream(name: string): Promise<Stream> {
  try {
    const res = await API.post<Stream>('streams', { name });
    return res.data;
  } catch (error) {
    console.log(`LIVES_API CREATE_STREAM name: ${name}, ERR: ${error}`)
    throw new ApiError("FAILED TO CREATE LIVESTREAM")
  }
}

export {
  getLiveStream,
  getLiveStreams,
  resetStreamPassword,
  updateStream,
  updateStreamName,
  deleteStream,
  createStream,
};
