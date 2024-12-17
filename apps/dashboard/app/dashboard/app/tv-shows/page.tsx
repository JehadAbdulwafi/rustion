"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { TvShowList } from "./components/tv-show-list"
import { getTvShows, deleteTvShow } from "@/api/TvShowApi"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"

export default function TvShowsPage() {
  const [tvShows, setTvShows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedShow, setSelectedShow] = useState<{ id: string, title: string } | null>(null)

  const fetchTvShows = async () => {
    try {
      const data = await getTvShows()
      setTvShows(data)
    } catch (error) {
      console.error("Failed to fetch TV shows:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTvShows()
  }, [])

  const handleDelete = async () => {
    if (!selectedShow) return
    await deleteTvShow(selectedShow.id)
    fetchTvShows()
  }

  if (loading) {
    return <div>Loading...</div>
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
      <TvShowList 
        tvShows={tvShows} 
        onDeleteShow={(show) => {
          setSelectedShow({
            id: show.id,
            title: show.title
          })
          setDeleteDialogOpen(true)
        }}
      />
    </div>
  )
}
