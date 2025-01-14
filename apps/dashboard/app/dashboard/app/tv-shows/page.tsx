import { getTvShows } from "@/api/TvShowApi"
import TvShowsScene from "./components/tv-shows-scene"

export default async function TvShowsPage() {
  const tvShows = await getTvShows()

  return (
    <TvShowsScene tvShows={tvShows} />

  )
}
