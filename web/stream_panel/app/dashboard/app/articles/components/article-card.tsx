"use client"

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="w-full max-h-96 pb-0 mb-0 group relative">
      <Link href={`/dashboard/app/articles/${article.id}`}>
        <CardContent className="flex flex-1 flex-col h-full w-full gap-4 p-0 pb-4 rounded-md overflow-hidden">
          <div className="relative aspect-video bg-muted/50">
            <div className="w-full relative h-full items-center justify-center">
              <Image
                src={"https://picsum.photos/350/200"}
                alt={article.image}
                fill
                objectFit="cover"
                className="opacity"
              />
            </div>
          </div>
          <div className="px-3">
            <h3 className="text-sm font-semibold">{article.title}</h3>
            <p className="text-xs text-muted-foreground">
              {article.description}
            </p>
          </div>
        </CardContent>
      </Link>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link href={`/dashboard/app/articles/${article.id}/edit`}>
          <Button size="icon" variant="secondary">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
