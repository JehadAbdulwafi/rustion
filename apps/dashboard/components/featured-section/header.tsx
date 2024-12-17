import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionDialog } from "@/components/dialogs/section-dialog"
import Link from "next/link"

interface HeaderProps {
  onCreate: (title: string, description: string) => Promise<void>
}

export function Header({ onCreate }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/app">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Featured Sections</h1>
          <p className="text-sm text-muted-foreground">
            View all of your featured sections here
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <SectionDialog
          onSubmit={onCreate}
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Section
            </Button>
          }
        />
      </div>
    </div>
  )
}
