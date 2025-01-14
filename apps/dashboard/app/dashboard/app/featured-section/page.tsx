
import {
  getFeaturedSectionsWithArticles,
} from "@/api/FeaturedSectionApi"
import FeaturedSectionScene from "./components/featured-scene"

export default async function FeaturedSectionPage() {
  const featuredSections = await getFeaturedSectionsWithArticles()

  return (
    <FeaturedSectionScene
      featuredSections={featuredSections}
    />
  )
}
