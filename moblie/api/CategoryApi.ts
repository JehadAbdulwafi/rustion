import { APIV1Client } from './APIV1Client';


async function getCategory(id: string): Promise<Category> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<Category>(`categories/${id}`, { method: 'GET' });
  return res
}
async function getCategories(): Promise<Category[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<Category[]>('categories', { method: 'GET' });
  return res
}

async function getCategoryWithArticles(id: string): Promise<CategoryWithArticles> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<CategoryWithArticles>(`categories/${id}/articles`, { method: 'GET' });
  return res
}

async function getCategoriesWithArticles(): Promise<CategoryWithArticles[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<CategoryWithArticles[]>('categories/articles', { method: 'GET' });
  return res
}


export default {
  getCategory,
  getCategories,
  getCategoryWithArticles,
  getCategoriesWithArticles,
};
