"use client"
import React from 'react'
import TagsList from './tags-list'
import ArticleList from './articles-list'
import { withHydration } from '@/components/hoc/with-hydration'

interface ArticlesSceneProps {
  tags: Tag[]
  articles: Article[]
}

function ArticlesScene({ tags, articles }: ArticlesSceneProps) {
  return (
    <div className="flex flex-col gap-4">
      <TagsList tags={tags} />
      <ArticleList articles={articles} />
    </div>
  )
}

export default withHydration(ArticlesScene)