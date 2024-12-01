import { APP_ID } from "@/config/app";
import { API } from "./axios";

async function getTvShow(id: string): Promise<TvShow> {
  const res = await API.get<TvShow>(`tv-shows/${id}`, { params: { app_id: APP_ID } });
  return res.data
}
async function getTvShows(): Promise<TvShow[]> {
  const res = await API.get<TvShow[]>('tv-shows', { params: { app_id: APP_ID } });
  return res.data
}

async function createTvShow(title: string, description: string, image: string, genre: string): Promise<TvShow> {
  const res = await API.post<TvShow>('tv-shows', {
    title,
    description,
    image,
    genre,
    app_id: APP_ID,
  });
  return res.data;
}

async function updateTvShow(id: string, title: string, description: string, image: string, genre: string): Promise<TvShow> {
  const res = await API.put<TvShow>(`tv-shows/${id}`, {
    title,
    description,
    image,
    genre,
    app_id: APP_ID,
  });
  return res.data;
}

async function deleteTvShow(id: string): Promise<void> {
  await API.delete(`tv-shows/${id}`);
}

export {
  getTvShow,
  getTvShows,
  createTvShow,
  updateTvShow,
  deleteTvShow,
};
