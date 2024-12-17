type FeaturedSection = {
  id: string
  title: string
  created_at: string
  updated_at: string
}

type PostUpdatePushTokenPayload = {
  app_id: string
  fingerprint: string
  newToken: string
  oldToken: string
  provider: string
}

type StreamStatus = {
  stream_id: string
  title: string
  description: string
  status: "published" | "unpublished";
  viewers: number
  thumbnail: string
}

type AppConfig = {
  id: string
  name: string
  userID: string
  config: string
}

type Config = {
  app_icon_url: string,
  splash_screen_url: string,
  privacy_policy_url: string, //
  terms_url: string, //
  support_url: string,
  faqs_url: string,
  forum_url: string,
  contact_url: string,
  app_store_url: string,
  play_store_url: string,
  app_version: string,
  force_update: boolean,
  maintenance_mode: boolean,
  maintenance_message: string,
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
