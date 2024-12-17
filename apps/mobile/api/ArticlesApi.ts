import { APIV1Client } from './APIV1Client';
import config from './config';

async function getArticle(id: string): Promise<Article> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<Article>(`articles/${id}`, { method: 'GET', searchParams: { app_id: config.app.id } });
  return res
}
async function getArticles(): Promise<Article[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<Article[]>('articles', { method: 'GET', searchParams: { app_id: config.app.id } });
  return res
}


export {
  getArticle,
  getArticles,
};
