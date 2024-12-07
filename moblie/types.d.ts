type FeaturedSection = {
  id: string
  title: string
  created_at: string
  updated_at: string
}

type StreamStatus = {
  stream_id: string
  title: string
  description: string
  status: "published" | "unpublished";
  viewers: number
  thumbnail: string
}

type TvShow = {
  id: string
  title: string
  description: string
  genre: string
  image: string
  created_at: string
  updated_at: string
}

type Article = {
  id: string
  title: string
  content: string
  description: string
  image: string
  tags: string
  created_at: string
  updated_at: string
}

type FeaturedSectionWithArticles = {
  featured_section: FeaturedSection
  articles: Article[]
}


type Tag = {
  id: string
  title: string
  created_at: string
  updated_at: string
}

type TagWithArticles = {
  category: Tag
  articles: Article[]
}
