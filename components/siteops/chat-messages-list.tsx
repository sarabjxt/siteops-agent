"use client"

import { memo, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import type { ChatMessage } from "@/types/siteops"
import { AlertCircle } from "lucide-react"
import Markdown from "react-markdown"
import { useMediaQuery } from "@base-ui/react/unstable-use-media-query"

interface ChatMessagesListProps {
  messages: ChatMessage[]
  loading: boolean
}

export const ChatMessagesList = memo(function ChatMessagesList({
  messages,
  loading,
}: ChatMessagesListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  const isDesktop = useMediaQuery("(min-width: 700px)", {
    defaultMatches: true,
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: isDesktop ? "start" : "nearest",
    })
  }, [messages, loading])

  return (
    <ScrollArea className="flex-1 p-4 sm:px-6">
      <div className="flex flex-col gap-3">
        {messages.map((m) => {
          const isUser = m.sender === "user"

          if (m.isError) {
            return (
              <Alert key={m.id} variant="destructive">
                <AlertCircle />
                <AlertTitle>Error processing update</AlertTitle>
                <AlertDescription>{m.text}</AlertDescription>
              </Alert>
            )
          }

          return (
            <div
              key={m.id}
              className={`flex max-w-[88%] flex-col gap-1 ${
                isUser ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <div className="flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
                <span className="font-medium">
                  {isUser ? "Site Supervisor" : "SiteOps Agent"}
                </span>
                <span>•</span>
                <span>{m.timestamp}</span>
              </div>
              <div
                className={`typeset typeset-docs rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "rounded-br-xs bg-primary text-primary-foreground"
                    : "rounded-bl-xs border border-border bg-muted/60 text-foreground"
                }`}
              >
                <Markdown>{m.text}</Markdown>
              </div>
            </div>
          )
        })}

        {loading ? (
          <div className="mr-auto flex max-w-[85%] items-center gap-2 rounded-2xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs text-muted-foreground">
            <Spinner />
            <span>
              Parsing Hinglish intent, calculating quantities & executing tools
              in DB...
            </span>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
})
