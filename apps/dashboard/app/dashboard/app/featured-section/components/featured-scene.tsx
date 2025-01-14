"use client"

import { useState } from "react"
import { Tags } from "lucide-react"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { SectionDialog } from "@/components/dialogs/section-dialog"
import { Header } from "@/components/featured-section/header"
import { SectionCard } from "@/components/featured-section/section-card"
import {
  createFeaturedSection,
  updateFeaturedSection,
  deleteFeaturedSection,
  updateFeaturedSectionArticles
} from "@/api/FeaturedSectionApi"
import { EmptyStateCard } from "@/components/empty-state-card"
import { useRouter } from "next/navigation"

interface FeaturedSectionWithArticles {
  featured_section: {
    id: string
    title: string
  }
  articles: Article[]
}

export default function FeaturedSectionScene({ featuredSections }: { featuredSections: FeaturedSectionWithArticles[] }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [removeArticleDialogOpen, setRemoveArticleDialogOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<{ id: string, title: string }>()
  const [selectedArticle, setSelectedArticle] = useState<{ sectionId: string, articleId: string, title: string, articles: Article[] }>()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const router = useRouter();

  const handleCreate = async (title: string, description: string) => {
    await createFeaturedSection(title, description)
    router.refresh();
  }

  const handleUpdate = (id: string) => async (title: string, description: string) => {
    await updateFeaturedSection(id, title, description)
    router.refresh();
  }

  const handleDelete = async () => {
    if (!selectedSection) return
    await deleteFeaturedSection(selectedSection.id)
    router.refresh();
  }

  const handleUpdateArticles = (sectionId: string) => async (articleIds: string[]) => {
    await updateFeaturedSectionArticles(sectionId, articleIds)
    router.refresh();
  }

  const handleRemoveArticle = async () => {
    if (!selectedArticle) return
    const newArticleIds = selectedArticle.articles
      .filter(article => article.id !== selectedArticle.articleId)
      .map(article => article.id)
    await updateFeaturedSectionArticles(selectedArticle.sectionId, newArticleIds)
    router.refresh();
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
