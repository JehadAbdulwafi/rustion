"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTag, updateTag, deleteTag } from "@/api/TagApi"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface TagDialogProps {
  mode: "create" | "edit" | "delete"
  tag?: Tag
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
}

export function TagDialog({ mode, tag, children, onOpenChange }: TagDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(tag?.title || "")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "create") {
        await createTag(title)
      } else if (mode === "edit" && tag) {
        await updateTag(tag.id, title)
      } else if (mode === "delete" && tag) {
        await deleteTag(tag.id)
      }
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Failed to save tag:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Tag" : mode === "edit" ? "Edit Tag" : "Delete Tag"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Create a new tag to organize your articles." 
              : mode === "edit"
              ? "Edit the tag title."
              : `Are you sure you want to delete the tag "${tag?.title}"? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {mode !== "delete" && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                  autoFocus
                  required
                />
              </div>
            </div>
          )}
          <DialogFooter>
            {mode === "delete" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </Button>
              </>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading 
                  ? mode === "create" 
                    ? "Creating..." 
                    : "Saving..." 
                  : mode === "create" 
                    ? "Create" 
                    : "Save"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
