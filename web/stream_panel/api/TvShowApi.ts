import { getAppIdSession } from "@/actions";
import { API } from "./axios";
import { ApiError } from "./ApiError";

async function getTvShow(id: string): Promise<TvShow> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<TvShow>(`tv-shows/${id}`, { params: { app_id: appId } });
    return res.data
  } catch (error) {
    throw new ApiError("FAILED TO GET TV SHOW")
  }
}
async function getTvShows(): Promise<TvShow[]> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<TvShow[]>('tv-shows', { params: { app_id: appId } });
    return res.data
  } catch (error) {
    throw new ApiError("FAILED TO GET TV SHOWS")
  }
}

async function createTvShow(title: string, description: string, image: string, genre: string): Promise<TvShow> {
  try {
    const res = await API.post<TvShow>('tv-shows', {
      title,
      description,
      image,
      genre,
    });
    return res.data;
  } catch (error) {
    throw new ApiError("FAILED TO CREATE TV SHOW")
  }
}

async function updateTvShow(id: string, title: string, description: string, image: string, genre: string): Promise<TvShow> {
  try {
    const res = await API.put<TvShow>(`tv-shows/${id}`, {
      title,
      description,
      image,
      genre,
    });
    return res.data;
  } catch (error) {
    throw new ApiError("FAILED TO UPDATE TV SHOW")
  }
}

async function deleteTvShow(id: string): Promise<void> {
  try {
    await API.delete(`tv-shows/${id}`);
  } catch (error) {
    throw new ApiError("FAILED TO DELETE TV SHOW")
  }
}

export {
  getTvShow,
  getTvShows,
  createTvShow,
  updateTvShow,
  deleteTvShow,
};
