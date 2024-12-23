import { cn } from "@/lib/utils"

interface HighlightedHeadingProps {
  beforeText?: string
  highlightedText: string
  afterText?: string
  className?: string
}

export function HighlightedHeading({
  beforeText,
  highlightedText,
  afterText,
  className,
}: HighlightedHeadingProps) {
  return (
    <h2 className={cn("text-3xl font-bold sm:text-4xl", className)}>
      {beforeText && <span>{beforeText} </span>}
      <span className="inline-flex items-center rounded-full bg-orange-500/10 px-4 py-1 text-orange-500">
        {highlightedText}
      </span>
      {afterText && <span> {afterText}</span>}
    </h2>
  )
}
