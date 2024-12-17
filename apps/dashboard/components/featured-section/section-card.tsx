import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AddArticleDialog } from "@/components/dialogs/add-article-dialog"
import { SectionDialog } from "@/components/dialogs/section-dialog"
import { ArticleCard } from "./article-card"

interface SectionCardProps {
  section: {
    featured_section: {
      id: string
      title: string
    }
    articles: Article[]
  }
  onUpdate: (title: string, description: string) => Promise<void>
  onUpdateArticles: (articleIds: string[]) => Promise<void>
  onDelete: () => void
  onRemoveArticle: (article: Article) => void
}

export function SectionCard({ 
  section, 
  onUpdate, 
  onUpdateArticles, 
  onDelete,
  onRemoveArticle 
}: SectionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">{section.featured_section.title}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <AddArticleDialog
            sectionId={section.featured_section.id}
            existingArticles={section.articles}
            onUpdate={onUpdateArticles}
          />
          <SectionDialog
            title={section.featured_section.title}
            onSubmit={onUpdate}
            trigger={
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="pr-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {section?.articles?.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onRemove={() => onRemoveArticle(article)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
