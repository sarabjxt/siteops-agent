"use client"

import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { ToolExecutionTrace } from "@/types/siteops"
import { Terminal, CheckCircle2, AlertCircle } from "lucide-react"

interface ToolTraceInspectorProps {
  traces: ToolExecutionTrace[]
}

export function ToolTraceInspector({ traces }: ToolTraceInspectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-medium">
            <Terminal className="text-primary" />
            <span>Execution Trace Log</span>
          </div>
          <Badge variant="outline">
            {traces.length} {traces.length === 1 ? "call" : "calls"}
          </Badge>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl bg-muted/50 p-4 dark:bg-card">
        {traces.length === 0 ? (
          <Empty className="px-4 py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Terminal />
              </EmptyMedia>
              <EmptyTitle>No tool traces yet</EmptyTitle>
              <EmptyDescription>
                When you send a message, the Gemini ReAct agent will parse the
                intent, call tools, and render input/output arguments here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {traces.map((trace, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/40 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-foreground">
                    {trace.tool}
                  </span>
                  {trace.result.success ? (
                    <Badge variant="secondary">
                      <CheckCircle2 data-icon="inline-start" />
                      Success
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle data-icon="inline-start" />
                      Failed
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase">
                    Arguments
                  </span>
                  <pre className="overflow-x-auto rounded-xl border border-border bg-background p-2 font-mono text-xs">
                    {JSON.stringify(trace.args, null, 2)}
                  </pre>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase">
                    Result
                  </span>
                  <pre className="overflow-x-auto rounded-xl border border-border bg-background p-2 font-mono text-xs text-foreground">
                    {JSON.stringify(trace.result, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
