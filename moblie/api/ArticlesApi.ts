import { APIV1Client } from './APIV1Client';


async function getArticle(id: string): Promise<Article> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<Article>(`articles/${id}`, { method: 'GET' });
  return res
}
async function getArticles(): Promise<Article[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<Article[]>('articles', { method: 'GET' });
  return res
}



export default {
  getArticle,
  getArticles,
};
