import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Clock, Eye, Radio } from "lucide-react";
import { formatStreamDuration } from "@/utils/format-time";

export default function StreamCard({ live }: { live: Stream }) {
  return (
    <Link href={`/dashboard/lives/${live.id}`}>
      <Card className="group overflow-hidden hover:ring-2 hover:ring-primary/50 hover:shadow-lg transition-all">
        <CardContent className="p-0">
          {/* Thumbnail Section */}
          <div className="relative aspect-video">
            <Image
              src={live.thumbnail}
              alt={live.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Status Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              {live.status === "published" ? (
                <>
                  <span className="animate-pulse h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-white bg-red-500/80 px-2 py-0.5 rounded-sm">
                    LIVE
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1.5 bg-zinc-900/80 px-2 py-0.5 rounded-sm">
                  <Radio className="h-3 w-3 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-300">Offline</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-4">
            {/* Title and Status */}
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{live.name}</h3>
              <p className="text-sm text-muted-foreground">
                {live.status === "published" ? (
                  <span className="text-emerald-500">Streaming now</span>
                ) : (
                  "Stream offline"
                )}
              </p>
            </div>

            {/* Stream Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">

              {/* Viewers */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{live.viewers || 0} {live.status === "published" ? "viewers" : "waiting"}</span>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{live.status === "published" ? formatStreamDuration(live.lastPublishedAt) : "Not started"}</span>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
