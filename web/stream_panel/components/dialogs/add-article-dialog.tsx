import { useState, useEffect } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getArticles } from "@/api/ArticleApi"

interface AddArticleDialogProps {
  sectionId: string
  existingArticles?: Article[]
  onUpdate: (articleIds: string[]) => Promise<void>
}

export function AddArticleDialog({ sectionId, existingArticles, onUpdate }: AddArticleDialogProps) {
  const [open, setOpen] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingArticles, setLoadingArticles] = useState(false)

  useEffect(() => {
    if (open) {
      setLoadingArticles(true)
      getArticles()
        .then(data => {
          if (existingArticles?.length) {
            // Only filter if there are existing articles
            const existingIds = new Set(existingArticles?.map(a => a.id))
            // @ts-ignore
            setArticles(data.filter(article => !existingIds.has(article.id)))
          } else {
            // If no existing articles, show all articles
            // @ts-ignore
            setArticles(data)
          }
        })
        .finally(() => {
          setLoadingArticles(false)
        })
    }
  }, [open, existingArticles])

  const handleAdd = async (articleId: string) => {
    try {
      setLoading(true)
      const newArticleIds = existingArticles?.length
        ? [...existingArticles.map(a => a.id), articleId]
        : [articleId]
      await onUpdate(newArticleIds)
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Skeleton className="h-4 w-4 mr-2" />
        Adding...
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Article to Section</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {loadingArticles ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="flex items-center p-4">
                    <Skeleton className="w-16 h-16 rounded mr-4" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="w-16 h-8 rounded" />
                  </Card>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No articles available to add
              </div>
            ) : (
              articles.map((article) => (
                <Card key={article.id} className="flex items-center p-4">
                  {article.image && (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{article.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {article.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAdd(article.id)}
                    disabled={loading}
                  >
                    Add
                  </Button>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
