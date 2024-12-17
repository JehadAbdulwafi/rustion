import { ApiError } from "./ApiError";
import { API } from "./axios";
import { getAppIdSession } from "@/actions";

async function getTag(id: string): Promise<Tag> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<Tag>(`tags/${id}`, { params: { app_id: appId } });
    return res.data
  } catch (error) {
    console.log(`TAGS_API GET_TAG ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO GET TAG")
  }
}

async function getTags(): Promise<Tag[]> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<Tag[]>('tags', { params: { app_id: appId } });
    return res.data
  } catch (error) {
    console.log(`TAGS_API GET_TAGS, ERR: ${error}`)
    throw new ApiError("FAILED TO GET TAGS")
  }
}

async function createTag(title: string): Promise<Tag> {
  try {
    const res = await API.post<Tag>('tags', { title });
    return res.data;
  } catch (error) {
    console.log(`TAGS_API CREATE_TAG, ERR: ${error}`)
    throw new ApiError("FAILED TO CREATE TAG")
  }
}

async function updateTag(id: string, title: string): Promise<Tag> {
  try {
    const res = await API.put<Tag>(`tags/${id}`, { title });
    return res.data;
  } catch (error) {
    console.log(`TAGS_API UPDATE_TAG ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO UPDATE TAG")
  }
}

async function deleteTag(id: string): Promise<void> {
  try {
    await API.delete(`tags/${id}`);
  } catch (error) {
    console.log(`TAGS_API DELETE_TAG ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO DELETE TAG")
  }
}

async function getTagWithArticles(id: string): Promise<TagWithArticles> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<TagWithArticles>(`tags/${id}/articles`, { params: { app_id: appId } });
    return res.data
  } catch (error) {
    console.log(`TAGS_API GET_TAG_WITH_ARTICLES ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO GET TAG WITH ARTICLES")

  }
}

async function getTagsWithArticles(): Promise<TagWithArticles[]> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<TagWithArticles[]>('tags/articles', { params: { app_id: appId } });
    return res.data
  } catch (error) {
    console.log(`TAGS_API GET_TAGS_WITH_ARTICLES ID, ERR: ${error}`)
    throw new ApiError("FAILED TO GET TAGS WITH ARTICLES")
  }
}

export {
  getTag,
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getTagWithArticles,
  getTagsWithArticles,
};
