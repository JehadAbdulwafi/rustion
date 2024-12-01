import { APP_ID } from "@/config/app";
import { API } from "./axios";

async function getFeaturedSection(id: string): Promise<FeaturedSection> {
  const res = await API.get<FeaturedSection>(`featured-sections/${id}`, { params: { app_id: APP_ID } });
  return res.data;
}

async function getFeaturedSections(): Promise<FeaturedSection[]> {
  const res = await API.get<FeaturedSection[]>('featured-sections', { params: { app_id: APP_ID } });
  return res.data;
}

async function getFeaturedSectionWithArticles(id: string): Promise<FeaturedSectionWithArticles> {
  const res = await API.get<FeaturedSectionWithArticles>(`featured-sections/${id}/articles`, { params: { app_id: APP_ID } });
  return res.data;
}

async function getFeaturedSectionsWithArticles(): Promise<FeaturedSectionWithArticles[]> {
  const res = await API.get<FeaturedSectionWithArticles[]>('featured-sections/articles', { params: { app_id: APP_ID } });
  return res.data;
}

async function createFeaturedSection(title: string, description: string): Promise<FeaturedSection> {
  const res = await API.post<FeaturedSection>('featured-sections', { title, description, app_id: APP_ID });
  return res.data;
}

async function updateFeaturedSection(id: string, title: string, description: string): Promise<FeaturedSection> {
  const res = await API.put<FeaturedSection>(`featured-sections/${id}`, { title, description, app_id: APP_ID });
  return res.data;
}

async function deleteFeaturedSection(id: string): Promise<void> {
  await API.delete(`featured-sections/${id}`, { params: { app_id: APP_ID } });
}

async function updateFeaturedSectionArticles(sectionId: string, articleIds: string[]): Promise<void> {
  await API.put(`featured-sections/${sectionId}/articles`, articleIds);
}

export {
  getFeaturedSection,
  getFeaturedSections,
  getFeaturedSectionWithArticles,
  getFeaturedSectionsWithArticles,
  createFeaturedSection,
  updateFeaturedSection,
  deleteFeaturedSection,
  updateFeaturedSectionArticles
};
