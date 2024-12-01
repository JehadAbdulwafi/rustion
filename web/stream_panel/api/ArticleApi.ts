import { APP_ID } from "@/config/app";
import { API } from "./axios";

async function getArticle(id: string): Promise<Article> {
  const res = await API.get<Article>(`articles/${id}`, { params: { app_id: APP_ID } });
  return res.data
}
async function getArticles(): Promise<Article[]> {
  const res = await API.get<Article[]>('articles', { params: { app_id: APP_ID } });
  return res.data
}

async function createArticle(title: string, description: string, image: string, content: string, tags: string): Promise<Article> {
  const res = await API.post<Article>('articles', { title, description, image, content, tags, app_id: APP_ID });
  return res.data
}

async function updateArticle(id: string, title: string, description: string, image: string, content: string, tags: string): Promise<Article> {
  const res = await API.put<Article>(`articles/${id}`, { title, description, image, content, tags, app_id: APP_ID });
  return res.data
}


export {
  getArticle,
  getArticles,
  createArticle,
  updateArticle,
};
