type FeaturedSection = {
  id: String
  title: String
  created_at: String
  updated_at: String
}

type Article = {
  id: String
  title: String
  content: String
  category_id: String
  created_at: String
  updated_at: String
}

type FeaturedSectionWithArticles = {
  featured_section: FeaturedSection
  articles: Article[]
}


type Category = {
  id: String
  // TODO: change it from name to title on the backend
  title: String
  created_at: String
  updated_at: String
}

type CategoryWithArticles = {
  category: Category
  articles: Article[]
}
