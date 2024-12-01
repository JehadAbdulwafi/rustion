import { Button } from '@/components/ui/button'
import ArticleCard from './article-card'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Articles</h2>
        <Link href="/dashboard/app/articles/new">
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {articles?.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}
