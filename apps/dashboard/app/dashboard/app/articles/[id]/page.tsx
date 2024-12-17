"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getArticle } from "@/api/ArticleApi"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticle(params.id as string)
        setArticle(data)
      } catch (error) {
        console.error("Failed to fetch article:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.id])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!article) {
    return <div>Article not found</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center px-4 justify-between">
        <Link href="/dashboard/app/articles">
          <Button variant="outline" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
        </Link>
        <Link href={`/dashboard/app/articles/${params.id}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Article
          </Button>
        </Link>
      </div>

      <Card className="border-none">
        <CardHeader>
          <h1 className="text-3xl font-bold">{article.title}</h1>
          <p className="text-muted-foreground">{article.description}</p>
          <div className="flex gap-2 mt-2">
            {article.tags.split(",").map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-gray-200 ProseMirror max-w-none" dangerouslySetInnerHTML={{ __html: article.content }}>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
