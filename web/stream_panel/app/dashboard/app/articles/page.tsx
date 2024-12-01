import { getArticles } from "@/api/ArticleApi"
import { getTags } from "@/api/TagApi"
import ArticlesScene from "./components/articles-scene"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const articles = await getArticles()
  const tags = await getTags()

  const selectedTags = (searchParams.tags as string)?.split(',') || []
  const filteredArticles = selectedTags.length > 0
    ? articles.filter(article =>
      selectedTags.every(tag => article.tags?.split(',').includes(tag))
    )
    : articles

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/app">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
            <p className="text-sm text-muted-foreground">
              View all of your articles here
            </p>
          </div>
        </div>
      </div>
      <ArticlesScene tags={tags} articles={filteredArticles} />
    </div>
  )
}
