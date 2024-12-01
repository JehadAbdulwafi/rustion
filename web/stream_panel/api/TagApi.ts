import { APP_ID } from "@/config/app";
import { API } from "./axios";

async function getTag(id: string): Promise<Tag> {
  const res = await API.get<Tag>(`tags/${id}`, { params: { app_id: APP_ID } });
  return res.data
}

async function getTags(): Promise<Tag[]> {
  const res = await API.get<Tag[]>('tags', { params: { app_id: APP_ID } });
  return res.data
}

async function createTag(title: string): Promise<Tag> {
  const res = await API.post<Tag>('tags', { title, app_id: APP_ID });
  return res.data;
}

async function updateTag(id: string, title: string): Promise<Tag> {
  const res = await API.put<Tag>(`tags/${id}`, { title, app_id: APP_ID });
  return res.data;
}

async function deleteTag(id: string): Promise<void> {
  await API.delete(`tags/${id}`, { params: { app_id: APP_ID } });
}

async function getTagWithArticles(id: string): Promise<TagWithArticles> {
  const res = await API.get<TagWithArticles>(`tags/${id}/articles`, { params: { app_id: APP_ID } });
  return res.data
}

async function getTagsWithArticles(): Promise<TagWithArticles[]> {
  const res = await API.get<TagWithArticles[]>('tags/articles', { params: { app_id: APP_ID } });
  return res.data
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
