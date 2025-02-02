"use client"

import * as React from "react"
import { CheckIcon, ClipboardIcon, RefreshCw } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function CopyButton({
  content,
  className,
  placeholder = "Copy to clipboard",
  ...props
}: {
  content: string
  placeholder?: string
} & ButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={cn(
            "[&_svg]-h-3.5 h-7 w-7 rounded-[6px] [&_svg]:w-3.5",
            className
          )}
          onClick={() => {
            navigator.clipboard.writeText(content)
            setHasCopied(true)
          }}
          {...props}
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-black text-white">{placeholder}</TooltipContent>
    </Tooltip>
  )
}


export function ResetButton({
  handleClick,
  isResetting,
  className,
  placeholder = "Reset",
  ...props
}: {
  handleClick: () => void
  isResetting: boolean
  placeholder?: string
} & ButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Tooltip>
      <TooltipTrigger asChild>

        <Button
          variant="outline"
          size="icon"
          onClick={handleClick}
          disabled={isResetting}

          className={cn(
            "[&_svg]-h-3.5 h-7 w-7 rounded-[6px] [&_svg]:w-3.5",
            className
          )}
          {...props}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin' : ''}`} />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-black text-white">{placeholder}</TooltipContent>
    </Tooltip>
  )
}