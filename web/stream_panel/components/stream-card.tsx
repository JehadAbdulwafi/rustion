import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";

export default function StreamCard({ live }: { live: Stream }) {
  return (
    <Link href={`/dashboard/lives/${live.id}`}>
      <Card className="w-full max-h-96 pb-0 mb-0">
        <CardContent className="flex flex-1 flex-col h-full w-full gap-4 p-0 pb-4 rounded-md overflow-hidden">
          <div className="relative aspect-video bg-muted/50">
            <div className="w-full relative h-full items-center justify-center">
              <Image
                src={"https://picsum.photos/350/200"}
                alt={live.name}
                fill
                objectFit="cover"
                // add some overlay
                className="opacity-50"
              />
            </div>

            <div className="absolute top-3 right-3 rounded-sm bg-muted-foreground px-2 py-1 text-xs font-medium text-white">
              {live.status === "published" ? "Online" : "Offline"}
            </div>
          </div>
          <div className="px-3">
            <h3 className="text-sm font-semibold">{live.name}</h3>
            <p className="text-xs text-muted-foreground">
              {live.status === "published" ? "Online" : "Offline"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

