"use client"

import { useState, useEffect, useCallback } from "react"
import type { AgentApiResponse } from "@/app/api/agent/route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SiteOpsHeader } from "@/components/siteops/siteops-header"
import { SamplePrompts } from "@/components/siteops/sample-prompts"
import { ChatMessagesList } from "@/components/siteops/chat-messages-list"
import { ChatInputForm } from "@/components/siteops/chat-input-form"
import { InventoryTable } from "@/components/siteops/inventory-table"
import { ExpenseTable } from "@/components/siteops/expense-table"
import { ToolTraceInspector } from "@/components/siteops/tool-trace-inspector"
import type {
  ChatMessage,
  InventoryRow,
  ExpenseRow,
  ToolExecutionTrace,
} from "@/types/siteops"
import { Package, Terminal } from "lucide-react"

export default function SiteOpsDashboard() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      sender: "agent",
      text: "SiteOps agent online. Send raw site updates, vendor notes, or cash payments in English, Hindi, or Hinglish.",
      timestamp: getTimestamp(),
    },
  ])
  const [initialDataLoading, setInitialDataLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [traces, setTraces] = useState<ToolExecutionTrace[]>([])
  const [inventoryList, setInventoryList] = useState<InventoryRow[]>([])
  const [expenseList, setExpenseList] = useState<ExpenseRow[]>([])

  useEffect(() => {
    const controller = new AbortController()
    async function loadData() {
      try {
        setInitialDataLoading(true)
        const res = await fetch("/api/agent", {
          signal: controller.signal,
        })
        if (res.ok) {
          const json = await res.json()
          setInventoryList(json.data?.inventory ?? [])
          setExpenseList(json.data?.expenses ?? [])
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return
        }
        console.error("Initial load failed", err)
      } finally {
        if (!controller.signal.aborted) {
          setInitialDataLoading(false)
        }
      }
    }
    loadData()
    return () => controller.abort()
  }, [])

  const handleSendMessage = useCallback(
    async (textToSend: string) => {
      const trimmed = textToSend.trim()
      if (!trimmed || loading) return

      const timeStr = getTimestamp()

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "user",
        text: trimmed,
        timestamp: timeStr,
      }

      setMessages((prev) => [...prev, userMessage])
      setLoading(true)

      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        })

        if (!res.ok) {
          const errPayload = await res.json().catch(() => ({}))
          throw new Error(errPayload.error || "Agent execution failed")
        }

        const data: AgentApiResponse = await res.json()

        const agentMessage: ChatMessage = {
          id: crypto.randomUUID(),
          sender: "agent",
          text: data.reply,
          timestamp: getTimestamp(),
        }

        setMessages((prev) => [...prev, agentMessage])
        if (data.traces && data.traces.length > 0) {
          setTraces((prev) => [...data.traces, ...prev])
        }
        if (data.data) {
          setInventoryList(data.data.inventory ?? [])
          setExpenseList(data.data.expenses ?? [])
        }
      } catch (err: unknown) {
        const errMsg =
          err instanceof Error ? err.message : "Failed to execute agent"
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: "agent",
            text: errMsg,
            timestamp: getTimestamp(),
            isError: true,
          },
        ])
      } finally {
        setLoading(false)
      }
    },
    [loading]
  )

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground lg:h-screen lg:overflow-hidden">
      <SiteOpsHeader />

      <main className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">
        {/* Left Section: Chat */}
        <section className="flex flex-col overflow-y-scroll border-b border-border lg:col-span-5 lg:border-r lg:border-b-0">
          <div className="p-4 lg:px-6">
            <SamplePrompts
              onSelectPrompt={handleSendMessage}
              disabled={loading}
            />
          </div>

          <ChatMessagesList messages={messages} loading={loading} />

          <div className="sticky bottom-0 bg-background p-4">
            <ChatInputForm
              onSendMessage={handleSendMessage}
              loading={loading}
            />
          </div>
        </section>

        {/* Right Section: Live Database Ledger & Tool Trace Inspector */}
        <section className="flex flex-col overflow-y-scroll p-4 pb-8 lg:col-span-7 lg:overflow-hidden lg:p-6">
          <Tabs
            defaultValue="ledger"
            className="flex h-full flex-col gap-6 sm:gap-8"
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="ledger">
                  <Package />
                  <span>Live Ledger</span>
                </TabsTrigger>
                <TabsTrigger value="traces">
                  <Terminal />
                  <span>Tool Traces</span>
                  {traces.length > 0 ? (
                    <Badge variant="secondary">{traces.length}</Badge>
                  ) : null}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="ledger" className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-6 sm:gap-8">
                <InventoryTable
                  items={inventoryList}
                  isLoading={initialDataLoading}
                />
                <ExpenseTable
                  items={expenseList}
                  isLoading={initialDataLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="traces" className="flex-1 overflow-y-auto">
              <ToolTraceInspector traces={traces} />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  )
}

function getTimestamp() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}
