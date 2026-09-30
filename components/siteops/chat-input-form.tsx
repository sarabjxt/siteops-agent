"use client"

import { memo, useState, useCallback } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ChatInputFormProps {
  onSendMessage: (message: string) => void
  loading: boolean
}

export const ChatInputForm = memo(function ChatInputForm({
  onSendMessage,
  loading,
}: ChatInputFormProps) {
  const [text, setText] = useState("")

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = text.trim()
      if (!trimmed || loading) return
      onSendMessage(trimmed)
      setText("")
    },
    [text, loading, onSendMessage]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        const trimmed = text.trim()
        if (!trimmed || loading) return
        onSendMessage(trimmed)
        setText("")
      }
    },
    [text, loading, onSendMessage]
  )

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <InputGroup className="items-end">
        <InputGroupTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type Hinglish site update (e.g. 100 bag cement aayi, ₹30,000 cash diya)..."
          disabled={loading}
          rows={1}
          className="max-h-32 text-sm"
        />
        <InputGroupAddon align="block-end">
          <Badge variant="outline">Gemini 3.5 Flash Lite</Badge>
          <InputGroupButton
            type="submit"
            size="icon-sm"
            variant="default"
            disabled={loading || !text.trim()}
            className="ml-auto"
          >
            {loading ? <Spinner /> : <Send />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
})
