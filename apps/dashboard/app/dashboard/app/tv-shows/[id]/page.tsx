"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { withHydration } from "@/components/hoc/with-hydration"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getTvShow, deleteTvShow } from "@/api/TvShowApi"
import Image from "next/image"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"

function TvShowDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [tvShow, setTvShow] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTvShow(params.id as string)
        setTvShow(data.tv_show)
      } catch (error) {
        console.error("Failed to load TV show data:", error)
        router.push("/dashboard/app/tv-shows")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id, router])

  const handleDelete = async () => {
    try {
      await deleteTvShow(params.id as string)
      router.push("/dashboard/app/tv-shows")
    } catch (error) {
      console.error("Failed to delete TV show:", error)
    }
  }

  if (!tvShow) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete TV Show"
        description={`Are you sure you want to delete "${tvShow.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/app/tv-shows">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{tvShow.title}</h1>
            <p className="text-sm text-muted-foreground">TV Show Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/app/tv-shows/${params.id}/edit`}>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            size="icon"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={tvShow.image || "https://picsum.photos/350/200"}
                alt={tvShow.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                <p className="text-lg">{tvShow.title}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Genre</h3>
                <p className="text-lg">{tvShow.genre}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-base text-muted-foreground whitespace-pre-wrap">
                  {tvShow.description}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default withHydration(TvShowDetailPage)
