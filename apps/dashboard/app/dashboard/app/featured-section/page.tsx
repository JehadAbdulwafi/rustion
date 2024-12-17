"use client"

import { useState, useEffect } from "react"
import { Tags } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { SectionDialog } from "@/components/dialogs/section-dialog"
import { Header } from "@/components/featured-section/header"
import { SectionCard } from "@/components/featured-section/section-card"
import { 
  getFeaturedSectionsWithArticles, 
  createFeaturedSection,
  updateFeaturedSection,
  deleteFeaturedSection,
  updateFeaturedSectionArticles
} from "@/api/FeaturedSectionApi"
import { EmptyStateCard } from "@/components/empty-state-card"

interface FeaturedSectionWithArticles {
  featured_section: {
    id: string
    title: string
  }
  articles: Article[]
}

export default function FeaturedSectionPage() {
  const [featuredSections, setFeaturedSections] = useState<FeaturedSectionWithArticles[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [removeArticleDialogOpen, setRemoveArticleDialogOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<{ id: string, title: string }>()
  const [selectedArticle, setSelectedArticle] = useState<{ sectionId: string, articleId: string, title: string, articles: Article[] }>()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const fetchSections = async () => {
    try {
      const data = await getFeaturedSectionsWithArticles()
      // @ts-ignore
      setFeaturedSections(data)
    } catch (error) {
      console.error("Failed to fetch featured sections:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [])

  const handleCreate = async (title: string, description: string) => {
    await createFeaturedSection(title, description)
    fetchSections()
  }

  const handleUpdate = (id: string) => async (title: string, description: string) => {
    await updateFeaturedSection(id, title, description)
    fetchSections()
  }

  const handleDelete = async () => {
    if (!selectedSection) return
    await deleteFeaturedSection(selectedSection.id)
    fetchSections()
  }

  const handleUpdateArticles = (sectionId: string) => async (articleIds: string[]) => {
    await updateFeaturedSectionArticles(sectionId, articleIds)
    fetchSections()
  }

  const handleRemoveArticle = async () => {
    if (!selectedArticle) return
    const newArticleIds = selectedArticle.articles
      .filter(article => article.id !== selectedArticle.articleId)
      .map(article => article.id)
    await updateFeaturedSectionArticles(selectedArticle.sectionId, newArticleIds)
    fetchSections()
  }

  if (loading) {
    return (
      <div className="space-y-4 px-4">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[150px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 px-4 pb-10">
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Featured Section"
        description={`Are you sure you want to delete "${selectedSection?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={removeArticleDialogOpen}
        onOpenChange={setRemoveArticleDialogOpen}
        title="Remove Article"
        description={`Are you sure you want to remove "${selectedArticle?.title}" from this section?`}
        onConfirm={handleRemoveArticle}
      />

      <Header onCreate={handleCreate} />

      {featuredSections?.length > 0 ? featuredSections?.map((section) => (
        <div key={section.featured_section.id} className="space-y-6">
          <SectionCard
            section={section}
            onUpdate={handleUpdate(section.featured_section.id)}
            onUpdateArticles={handleUpdateArticles(section.featured_section.id)}
            onDelete={() => {
              setSelectedSection({
                id: section.featured_section.id,
                title: section.featured_section.title
              })
              setDeleteDialogOpen(true)
            }}
            onRemoveArticle={(article) => {
              setSelectedArticle({
                sectionId: section.featured_section.id,
                articleId: article.id,
                title: article.title,
                articles: section.articles
              })
              setRemoveArticleDialogOpen(true)
            }}
          />
        </div>
      )) : (
        <EmptyStateCard
          title="No Featured Sections"
          description="Featured Sections will appear here once you've created them."
          icon={Tags}
          actionLabel='Create Featured Section'
          onActionClick={() => setCreateDialogOpen(true)}
        />
      )}

      <SectionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
      />
    </div>
  )
}
