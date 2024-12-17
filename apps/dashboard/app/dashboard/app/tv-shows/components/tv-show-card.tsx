import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface TvShowCardProps {
  tvShow: any
  onDelete: () => void
}

export function TvShowCard({ tvShow, onDelete }: TvShowCardProps) {
  return (
    <Card>
      <CardHeader className="relative aspect-video p-0">
        <Image
          src={tvShow.image || "https://picsum.photos/350/200"}
          alt={tvShow.title}
          fill
          className="rounded-t-lg object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="line-clamp-1">{tvShow.title}</CardTitle>
        <CardDescription className="line-clamp-2 mt-2">
          {tvShow.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <div className="text-sm text-muted-foreground">{tvShow.genre}</div>
        <div className="flex gap-2">
          <Link href={`/dashboard/app/tv-shows/${tvShow.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/app/tv-shows/${tvShow.id}/edit`}>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
