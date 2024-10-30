import { icons } from "lucide-react-native";

type IconNames = keyof typeof icons;

type FeaturedSection = {
  id: string
  title: string
  created_at: string
  updated_at: string
}

type Article = {
  id: string
  title: string
  content: string
  description: string
  image: string
  category_id: string
  created_at: string
  updated_at: string
}

type FeaturedSectionWithArticles = {
  featured_section: FeaturedSection
  articles: Article[]
}


type Category = {
  id: string
  title: string
  created_at: string
  updated_at: string
}

type CategoryWithArticles = {
  category: Category
  articles: Article[]
}
