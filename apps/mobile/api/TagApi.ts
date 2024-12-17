import { APIV1Client } from './APIV1Client';
import config from './config';


async function getTag(id: string): Promise<Tag> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<Tag>(`tags/${id}`, { method: 'GET', searchParams: { app_id: config.app.id } });
  return res
}
async function getTags(): Promise<Tag[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<Tag[]>('tags', { method: 'GET', searchParams: { app_id: config.app.id } });
  return res
}

async function getTagWithArticles(id: string): Promise<TagWithArticles> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<TagWithArticles>(`tags/${id}/articles`, { method: 'GET', searchParams: { app_id: config.app.id } });
  return res
}

async function getTagsWithArticles(): Promise<TagWithArticles[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<TagWithArticles[]>('tags/articles', { method: 'GET', searchParams: { app_id: config.app.id } });
  return res
}


export {
  getTag,
  getTags,
  getTagWithArticles,
  getTagsWithArticles,
};
