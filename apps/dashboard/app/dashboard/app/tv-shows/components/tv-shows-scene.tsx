"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { deleteTvShow } from "@/api/TvShowApi"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { TvShowCard } from "./tv-show-card"
import { useRouter } from "next/navigation"

export default function TvShowsScene({ tvShows }: { tvShows: TvShow[] }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedShow, setSelectedShow] = useState<{ id: string, title: string } | null>(null)
  const router = useRouter();

  const handleDelete = async () => {
    if (!selectedShow) return
    await deleteTvShow(selectedShow.id)
    router.refresh();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete TV Show"
        description={`Are you sure you want to delete "${selectedShow?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/app">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">TV Shows</h1>
            <p className="text-sm text-muted-foreground">
              Manage your TV shows and episodes
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Link href="/dashboard/app/tv-shows/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create TV Show
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tvShows?.map((tvShow) => (
          <TvShowCard
            key={tvShow.id}
            tvShow={tvShow}
            onDelete={() => {
              setSelectedShow({
                id: tvShow.id,
                title: tvShow.title
              })
              setDeleteDialogOpen(true)
            }}
          />
        ))}
      </div>
    </div>
  )
}
