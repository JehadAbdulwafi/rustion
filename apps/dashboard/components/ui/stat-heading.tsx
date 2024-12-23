import { cn } from "@/lib/utils"
import Image from "next/image"

interface StatHeadingProps {
  beforeText?: string
  number: string
  afterText?: string
  className?: string
}

export function StatHeading({
  beforeText,
  number,
  afterText,
  className,
}: StatHeadingProps) {
  return (
    <h2 className={cn("text-3xl font-bold sm:text-4xl", className)}>
      {beforeText && <span>{beforeText} </span>}
      <span className="relative inline-flex items-center justify-center">
        <Image
          src="/assets/dark-circle.png"
          alt=""
          width={200}
          height={80}
          className="absolute"
          style={{
          }}
        />
        <span className="relative text-orange-500 px-4 py-1 z-10">
          {number}
        </span>
      </span>
      {afterText && <span> {afterText}</span>}
    </h2>
  )
}
