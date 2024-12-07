import { ApiError } from "./ApiError";
import { API } from "./axios";
import { getAppIdSession } from "@/actions";

async function getFeaturedSection(id: string): Promise<FeaturedSection> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<FeaturedSection>(`featured-sections/${id}`, { params: { app_id: appId } });
    return res.data;
  } catch (error) {
    console.log(`FEATURED_API GET_FEATURED_SECTION ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO GET FEATURED SECTION")
  }
}

async function getFeaturedSections(): Promise<FeaturedSection[]> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<FeaturedSection[]>('featured-sections', { params: { app_id: appId } });
    return res.data;
  } catch (error) {
    console.log(`FEATURED_API GET_FEATURED_SECTIONS, ERR: ${error}`)
    throw new ApiError("FAILED TO GET FEATURED SECTIONS")
  }
}

async function getFeaturedSectionWithArticles(id: string): Promise<FeaturedSectionWithArticles> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<FeaturedSectionWithArticles>(`featured-sections/${id}/articles`, { params: { app_id: appId } });
    return res.data;
  } catch (error) {
    console.log(`FEATURED_API GET_FEATURED_SECTION_WITH_ARTICLES ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO GET FEATURED SECTION WITH ARTICLES")
  }
}

async function getFeaturedSectionsWithArticles(): Promise<FeaturedSectionWithArticles[]> {
  try {
    const appId = await getAppIdSession();
    const res = await API.get<FeaturedSectionWithArticles[]>('featured-sections/articles', { params: { app_id: appId } });
    return res.data;
  } catch (error) {
    console.log(`FEATURED_API GET_FEATURED_SECTIONS_WITH_ARTICLES, ERR: ${error}`)
    throw new ApiError("FAILED TO GET FEATURED SECTIONS WITH ARTICLES")
  }
}

async function createFeaturedSection(title: string, description: string): Promise<FeaturedSection> {
  try {
    const res = await API.post<FeaturedSection>('featured-sections', { title, description });
    return res.data;
  } catch (error) {
    console.log(`FEATURED_API CREATE_FEATURED_SECTION, ERR: ${error}`)
    throw new ApiError("FAILED TO CREATE FEATURED SECTION")
  }
}

async function updateFeaturedSection(id: string, title: string, description: string): Promise<FeaturedSection> {
  try {
    const res = await API.put<FeaturedSection>(`featured-sections/${id}`, { title, description });
    return res.data;
  } catch (error) {
    console.log(`FEATURED_API UPDATE_FEATURED_SECTION ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO UPDATE FEATURED SECTION")
  }
}

async function deleteFeaturedSection(id: string): Promise<void> {
  try {
    await API.delete(`featured-sections/${id}`);
  } catch (error) {
    console.log(`FEATURED_API DELETE_FEATURED_SECTION ID: ${id}, ERR: ${error}`)
    throw new ApiError("FAILED TO DELETE FEATURED SECTION")
  }
}

async function updateFeaturedSectionArticles(sectionId: string, articleIds: string[]): Promise<void> {
  try {
    await API.put(`featured-sections/${sectionId}/articles`, articleIds);
  } catch (error) {
    console.log(`FEATURED_API UPDATE_FEATURED_SECTION_ARTICLES ID: ${sectionId}, ERR: ${error}`)
    throw new ApiError("FAILED TO UPDATE FEATURED ARTICLES")
  }
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
