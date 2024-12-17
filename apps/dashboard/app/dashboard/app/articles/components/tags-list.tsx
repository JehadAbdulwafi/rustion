"use client"
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { TagDialog } from './tag-dialog'
import { Plus, Pencil, MoreHorizontal, Trash } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'

export default function TagsList({ tags }: { tags: Tag[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedTags = searchParams.get('tags')?.split(',') || []
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})

  const handleTagClick = (tagTitle: string) => {
    const newTags = selectedTags.includes(tagTitle)
      ? selectedTags.filter(t => t !== tagTitle)
      : [...selectedTags, tagTitle]

    if (newTags.length === 0) {
      router.push(pathname)
      return
    }

    router.push(`${pathname}?tags=${newTags.join(',')}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tags</h2>
        <TagDialog mode="create">
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </TagDialog>
      </div>
      <div className="flex flex-row gap-2 flex-wrap">
        <Button
          size={"sm"}
          variant={selectedTags.length === 0 ? "default" : "outline"}
          onClick={() => router.push(pathname)}
        >
          all
        </Button>
        {tags?.map((tag) => (
          <div key={tag.id} className="group relative flex items-center">
            <div
              onClick={() => handleTagClick(tag.title)}
              className={cn(
                "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border cursor-pointer",
                selectedTags.includes(tag.title)
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-background hover:bg-accent hover:text-accent-foreground border-input",
                openMenus[tag.id] ? "pr-9" : "pr-3 group-hover:pr-9"
              )}
            >
              {tag.title}
            </div>
            <div
              className={cn(
                "absolute right-1.5 transition-all duration-200",
                openMenus[tag.id]
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              )}
            >
              <DropdownMenu
                open={openMenus[tag.id]}
                onOpenChange={(open) => setOpenMenus(prev => ({ ...prev, [tag.id]: open }))}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 mt-1 w-6 p-0 hover:bg-accent">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <TagDialog mode="edit" tag={tag}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  </TagDialog>
                  <TagDialog
                    mode="delete"
                    tag={tag}
                    onOpenChange={(open) => {
                      if (!open) {
                        setOpenMenus(prev => ({ ...prev, [tag.id]: false }))
                      }
                    }}
                  >
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </TagDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
