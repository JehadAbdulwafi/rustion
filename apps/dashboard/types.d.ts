type StreamStatus = {
  stream_id: string;
  title: string;
  description: string;
  status: "published" | "unpublished";
  viewers: number;
  thumbnail: string;
}

type App = {
  userID: string
  name: string
  config: string
}

type Stream = {
  id: string;
  title: string;
  description: string;
  status: "published" | "unpublished";
  viewers: number;
  thumbnail: string;
  liveTitle: string;
  liveDescription: string;
  lastPublishedAt: string;
  userId: string;
  name: string;
  app: string;
  endpoint: string;
  secret: string;
  host: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

type User = {
  id: string
  name: string
  email: string
  app_id: string | null;
}

type FeaturedSection = {
  id: string
  title: string
  created_at: string
  updated_at: string
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

type FAQ = {
  id: string
  question: string
  answer: string
  created_at: string
  updated_at: string
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

type Feedback = {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  updated_at: string
}

