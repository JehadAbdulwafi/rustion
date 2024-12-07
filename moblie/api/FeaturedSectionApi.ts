import { APIV1Client } from './APIV1Client';
import config from './config';


async function getFeaturedSection(id: string): Promise<FeaturedSection> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<FeaturedSection>(`featured-sections/${id}`, { method: 'GET', searchParams: { app_id: config.app.id } });
  return res
}
async function getFeaturedSections(): Promise<FeaturedSection[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<FeaturedSection[]>('featured-sections', { method: 'GET', searchParams: { app_id: config.app.id } });
  return res
}

async function getFeaturedSectionWithArticles(id: string): Promise<FeaturedSectionWithArticles> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<FeaturedSectionWithArticles>(`featured-sections/${id}/articles`, { method: 'GET', searchParams: { app_id: config.app.id } });
  return res
}

async function getFeaturedSectionsWithArticles(): Promise<FeaturedSectionWithArticles[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<FeaturedSectionWithArticles[]>('featured-sections/articles', { method: 'GET', searchParams: { app_id: config.app.id } });
  return res
}


export {
  getFeaturedSection,
  getFeaturedSections,
  getFeaturedSectionWithArticles,
  getFeaturedSectionsWithArticles,
};
