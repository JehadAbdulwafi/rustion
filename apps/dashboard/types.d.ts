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
type ForwardSecret = {
  platform: string;
  server: string;
  secret: string;
  enabled: boolean;
  custom: boolean;
  label: string;
  files: FFprobeSource[]
};

type FFprobeSource = {
  // The file name.
  name: string
  // The file path.
  path: string
  // The size in bytes.
  size: number
  // The file UUID.
  uuid: string
  // The target file name.
  target: string
  // The source type.
  type: "upload" | "file" | "ytdl" | "stream"
  // The file format by ffprobe.
  format: FFprobeFormat
  // The video information by ffprobe.
  video: FFprobeVideo
  // The audio information by ffprobe.
  audio: FFprobeAudio
}


type FFprobeFormat = {
  // The start time in seconds.
  start_time: string
  // The duration in seconds.
  duration: string
  // The bitrate in bps.
  bit_rate: string
  // The number of streams in file. Note that there might be audio, video, and data stream,
  // so if the streams is 2, it may indicate audio+video, video+data, or audio+data.
  nb_streams: number
  // The probe score, which indicates the confidence of the format detection.
  probe_score: number
  // Whether has video stream.
  has_video: boolean
  // Whether has audio stream.
  has_audio: boolean
}

type FFprobeVideo = {
  // The codec type, should be video.
  codec_type: string
  // The codec name, for example, h264, h265, vp6f, vp8, vp9, av1, or avs3.
  codec_name: string
  // The codec profile, for example, High, Main, Baseline, or Constrained Baseline.
  profile: string
  // The width of video.
  width: number
  // The height of video.
  height: number
  // The pixel format, for example, yuv420p, yuv422p, yuv444p, yuv410p, yuv411p, yuvj420p,
  pix_fmt: string
  // The level of video.
  level: number
  // The bitrate in bps.
  bit_rate: string
  // The start time in seconds.
  start_time: string
  // The duration in seconds.
  duration: string
}


type FFprobeAudio = {
  // The codec type, should be audio.
  codec_type: string
  // The codec name, for example, aac, mp3, opus, vorbis, or flac.
  codec_name: string
  // The codec profile, for example, AAC LC, AAC HE, AAC HEv2, or AAC LD.
  profile: string
  // The sample format, for example, fltp, s16p, s32p, s64p, or dbl.
  sample_fmt: string
  // The sample rate in Hz.
  sample_rate: string
  // The number of channels.
  channels: number
  // The channel layout, for example, mono, stereo, 5.1, or 7.1.
  channel_layout: string
  // The bitrate in bps.
  bit_rate: string
  // The start time in seconds.
  start_time: string
  // The duration in seconds.
  duration: string
}

type ForwardConfigMap = Record<string, ForwardSecret>;

interface ForwardConfig {
  platform: string; // Platform name (e.g., wx, bilibili, kuaishou)
  enabled: boolean; // Whether the platform is enabled
  index: string; // Unique index for the configuration
  allowCustom: boolean; // Whether custom configuration is allowed
  custom?: boolean; // Optional flag for custom configurations
  locale: LocaleConfig; // Locale-specific configuration
  label: string;
  server: string;
  secret: string;
  stream?: string; // The stream URL (if available)
  start?: string; // The start time of the stream (if available)
  ready?: string; // Ready status of the stream (if available)
  frame?: FrameInfo; // Frame information (if available)
  update?: string; // Timestamp of the last update
  name?: string; // Name of the platform
  files?: FFprobeSource[]
  i?: number;
}

interface LocaleConfig {
  label: string | null;
  link: string;
  link2: string;
  generate: (config: Config) => void;
}

interface ForwardStatus {
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
  files: FFprobeSource[]
  i?: number;
}

interface FrameInfo {
  log: string; // Log file or message related to the frame
  update: string; // Timestamp or details of the last update
}

type ForwardStatus = ForwardStatus[];


type Channel = {
  id: string;
  user_id: string;
  platform: string;
  server: string;
  secret: string;
  enabled: boolean;
  custom: boolean;
  label: string;
}


type Plan = {
  CreatedAt: string
  description: string
  features: string
  id: string
  IsActive: boolean
  name: string
  PriceMonthly: string
  PriceYearly: string
  UpdatedAt: string
}

type Subscription = {
  id: string
  userID: string
  planID: string
  PlanName: string
  billingCycle: string
  currentPeriodEnd: string
  currentPeriodStart: string
  status: string
  updatedAt: string
  createdAt: string
}


type Transaction = {
  amount: string
  createdAt: string
  currency: string
  errorMessage: string
  id: string
  paymentMethod: string
  status: string
  subscriptionID: string
  updatedAt: string
}
