"use client"

import { memo } from "react"
import { SAMPLE_PROMPTS, type PromptItem } from "@/types/siteops"
import { Sparkles } from "lucide-react"

interface SamplePromptsProps {
  onSelectPrompt: (prompt: string) => void
  disabled?: boolean
}

export const SamplePrompts = memo(function SamplePrompts({
  onSelectPrompt,
  disabled = false,
}: SamplePromptsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Sparkles className="size-3.5" />
        <span>Sample Prompts (Click to test agent parsing)</span>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SAMPLE_PROMPTS.map((item: PromptItem) => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(item.prompt)}
            className="flex h-auto items-start rounded-xl rounded-br-xs bg-muted/70 px-3 py-2.5 text-left text-xs font-normal whitespace-normal text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
          >
            {item.prompt}
          </button>
        ))}
      </div>
    </div>
  )
})
