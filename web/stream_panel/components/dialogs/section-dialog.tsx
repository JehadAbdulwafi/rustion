import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SectionDialogProps {
  title?: string
  description?: string
  trigger?: React.ReactNode
  onSubmit: (title: string, description: string) => Promise<void>
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SectionDialog({ 
  title, 
  description, 
  trigger, 
  onSubmit, 
  open: controlledOpen, 
  onOpenChange 
}: SectionDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formTitle, setFormTitle] = useState(title || "")
  const [formDescription, setFormDescription] = useState(description || "")

  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen
  const setIsOpen = isControlled ? onOpenChange : setUncontrolledOpen

  useEffect(() => {
    if (isOpen) {
      setFormTitle(title || "")
      setFormDescription(description || "")
    }
  }, [isOpen, title, description])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await onSubmit(formTitle, formDescription)
      setIsOpen(false)
      if (!isControlled) {
        setFormTitle("")
        setFormDescription("")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title ? "Edit Section" : "Create Section"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Title
              </label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Enter section title"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Description
              </label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter section description"
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !formTitle}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {title ? "Updating..." : "Creating..."}
                </>
              ) : title ? (
                "Update Section"
              ) : (
                "Create Section"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
