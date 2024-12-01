import { APP_ID } from "@/config/app";
import { API } from "./axios";

async function getLive(id: string): Promise<Stream> {
  const res = await API.get<Stream>(`streams/${id}`, { params: { app_id: APP_ID } });
  return res.data
}

async function getLives(): Promise<Stream[]> {
  const res = await API.get<Stream[]>('streams', { params: { app_id: APP_ID } });
  return res.data
}

async function resetStreamPassword(id: string): Promise<Stream> {
  const res = await API.post<Stream>(`streams/${id}/reset-password`, { app_id: APP_ID });
  return res.data;
}

async function updateStream(id: string, data: Partial<Stream>): Promise<Stream> {
  const res = await API.put<Stream>(`streams/${id}`, { ...data, app_id: APP_ID });
  return res.data;
}

async function updateStreamName(id: string, data: Partial<Stream>): Promise<Stream> {
  const res = await API.put<Stream>(`streams/${id}/name`, { ...data, app_id: APP_ID });
  return res.data;
}

async function deleteStream(id: string): Promise<void> {
  await API.delete(`streams/${id}`, { params: { app_id: APP_ID } });
}

export {
  getLive,
  getLives,
  resetStreamPassword,
  updateStream,
  updateStreamName,
  deleteStream,
};
