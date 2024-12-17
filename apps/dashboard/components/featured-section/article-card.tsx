import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

interface ArticleCardProps {
  article: Article
  onRemove: () => void
}

export function ArticleCard({ article, onRemove }: ArticleCardProps) {
  return (
    <Card className="relative group">
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onRemove()
        }}
      >
        <X className="h-4 w-4" />
      </Button>
      <Link
        href={`/dashboard/app/articles/${article.id}`}
        className="block hover:opacity-80 transition-opacity"
      >
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-32 object-cover rounded-t-lg"
          />
        )}
        <CardHeader className="p-3">
          <CardTitle className="text-sm line-clamp-2">{article.title}</CardTitle>
          <CardDescription className="text-xs line-clamp-2">
            {article.description}
          </CardDescription>
        </CardHeader>
      </Link>
    </Card>
  )
}
