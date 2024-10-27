import { APIV1Client } from './APIV1Client';


async function getFeaturedSection(id: string): Promise<FeaturedSection> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<FeaturedSection>(`featured-sections/${id}`, { method: 'GET' });
  return res
}
async function getFeaturedSections(): Promise<FeaturedSection[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<FeaturedSection[]>('featured-sections', { method: 'GET' });
  return res
}

async function getFeaturedSectionWithArticles(id: string): Promise<FeaturedSectionWithArticles> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<FeaturedSectionWithArticles>(`featured-sections/${id}/articles`, { method: 'GET' });
  return res
}

async function getFeaturedSectionsWithArticles(): Promise<FeaturedSectionWithArticles[]> {
  const api = new APIV1Client();
  const res = await api.sendUnauthenticatedApiV1Request<FeaturedSectionWithArticles[]>('featured-sections/articles', { method: 'GET' });
  return res
}


export default {
  getFeaturedSection,
  getFeaturedSections,
  getFeaturedSectionWithArticles,
  getFeaturedSectionsWithArticles,
};
