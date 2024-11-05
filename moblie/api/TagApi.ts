import { APIV1Client } from './APIV1Client';


async function getTag(id: string): Promise<Tag> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<Tag>(`tags/${id}`, { method: 'GET' });
  return res
}
async function getTags(): Promise<Tag[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<Tag[]>('tags', { method: 'GET' });
  return res
}

async function getTagWithArticles(id: string): Promise<TagWithArticles> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<TagWithArticles>(`tags/${id}/articles`, { method: 'GET' });
  return res
}

async function getTagsWithArticles(): Promise<TagWithArticles[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<TagWithArticles[]>('tags/articles', { method: 'GET' });
  return res
}


export {
  getTag,
  getTags,
  getTagWithArticles,
  getTagsWithArticles,
};
