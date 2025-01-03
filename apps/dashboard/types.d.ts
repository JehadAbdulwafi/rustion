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

// #### FORWARD #########
type ForwardConfigure = {
  platform: string; // The platform name, e.g., wx
  server: string;   // The RTMP server URL, e.g., rtmp://localhost/live
  secret: string;   // The RTMP stream and secret, e.g., livestream
  enabled: boolean; // Whether enabled
  custom: boolean;  // Whether custom platform
  label: string;    // The label for this configuration
};

interface LocaleConfig {
  label: string | null;
  link: string;
  link2: string;
  generate: (config: Config) => void;
}

interface Config {
  platform: string; // Platform name (e.g., wx, bilibili, kuaishou)
  enabled: boolean; // Whether the platform is enabled
  index: string; // Unique index for the configuration
  allowCustom: boolean; // Whether custom configuration is allowed
  custom?: boolean; // Optional flag for custom configurations
  locale: LocaleConfig; // Locale-specific configuration
  [key: string]: any; // Allow additional properties from `defaultSecrets`
}

// State type for `configs`
type ConfigsState = Config[];

type ForwardConfigMap = Record<string, ForwardConfigure>;

interface FrameInfo {
  log: string; // Log file or message related to the frame
  update: string; // Timestamp or details of the last update
}

interface StreamElement {
  platform: string; // The platform name
  enabled: boolean; // Whether the platform is enabled
  custom: boolean; // Whether the platform is custom
  label: string; // Label for the configuration
  stream?: string; // The stream URL (if available)
  start?: string; // The start time of the stream (if available)
  ready?: string; // Ready status of the stream (if available)
  frame?: FrameInfo; // Frame information (if available)
  update?: string; // Timestamp of the last update
  name?: string; // Name of the platform
  i?: number;
}

type StreamResponse = StreamElement[];
