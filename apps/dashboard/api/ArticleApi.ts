import { getAppIdSession } from "@/actions";
import { API } from "./axios";
import { ApiError } from "./ApiError";

async function getArticle(id: string): Promise<Article> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<Article>(`articles/${id}`, { params: { app_id: appId } });
    return res.data
  } catch (error) {
    console.log(`ARTICLES_API GET_ARTICLE ID: ${id}, ERR:`, error)
    throw new ApiError("FAILED TO GET ARTICLE")
  }
}

async function getArticles(): Promise<Article[]> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<Article[]>('articles', { params: { app_id: appId } });
    return res.data
  } catch (error) {
    console.log("ARTICLES_API GET_ARTICLES, ERR:", error)
    throw new ApiError("FAILED TO GET ARTICLES")
  }
}

async function createArticle(title: string, description: string, image: string, content: string, tags: string): Promise<Article> {
  try {
    const res = await API.post<Article>('articles', { title, description, image, content, tags });
    return res.data
  } catch (error) {
    console.log("ARTICLES_API CREATE_ARTICLES, ERR:", error)
    throw new ApiError("FAILED TO CREATE ARTICLE")
  }
}

async function updateArticle(id: string, title: string, description: string, image: string, content: string, tags: string): Promise<Article> {
  try {
    const res = await API.put<Article>(`articles/${id}`, { title, description, image, content, tags });
    return res.data
  } catch (error) {
    console.log("ARTICLES_API UPDATE_ARTICLES, ERR:", error)
    throw new ApiError("FAILED TO UPDATE ARTICLE")
  }
}

async function deleteArticle(id: string): Promise<void> {
  try {
    const appId = await getAppIdSession();
    await API.delete(`articles/${id}`, { params: { app_id: appId } });
  } catch (error) {
    console.log("ARTICLES_API DELETE_ARTICLES, ERR:", error)
    throw new ApiError("FAILED TO DELETE ARTICLE")
  }
}

export {
  getArticle,
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
};
