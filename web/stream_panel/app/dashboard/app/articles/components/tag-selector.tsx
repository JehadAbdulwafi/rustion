"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({
  tags,
  selectedTags,
  onChange
}: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const safeSelectedTags = selectedTags || []
  const safeTags = tags || []

  const toggleTag = (tag: string) => {
    onChange(
      safeSelectedTags.includes(tag)
        ? safeSelectedTags.filter(t => t !== tag)
        : [...safeSelectedTags, tag]
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            Select tags...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {safeTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.title}
                    onSelect={() => toggleTag(tag.title)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        safeSelectedTags.includes(tag.title) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tag.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {safeSelectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {safeSelectedTags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              <span className="ml-1 text-xs">×</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
