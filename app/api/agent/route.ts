import { db } from "@/db/drizzle"
import { expenses, inventory } from "@/db/schema"
import {
  agentFunctionDeclarations,
  AgentToolResult,
  getToolName,
  isSupportedTool,
  toolRegistry,
} from "@/lib/tools"
import { Content, GoogleGenAI } from "@google/genai"
import { desc } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const requestSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty"),
})

export interface ToolExecutionTrace {
  tool: string
  args: Record<string, unknown>
  result: AgentToolResult
}

export interface AgentApiResponse {
  reply: string
  traces: ToolExecutionTrace[]
  data: {
    inventory: (typeof inventory.$inferSelect)[]
    expenses: (typeof expenses.$inferSelect)[]
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json()
    const parsedBody = requestSchema.safeParse(rawBody)

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: z.treeifyError(parsedBody.error),
        },
        { status: 400 }
      )
    }

    const { message } = parsedBody.data
    const traces: ToolExecutionTrace[] = []

    const systemInstruction = `
    You are an autonomous site operations agent for a construction manager on WhatsApp.
    Your job is to read unstructured messages in English, Hindi, or Hinglish, decide what tools to invoke, and execute them.

    Guidelines:
    - If materials arrive or are delivered: call '${getToolName("recordInventoryArrival")}'.
    - If money is spent, transferred, or paid to suppliers/labor: call '${getToolName("recordSiteExpense")}'.
    - If a message mentions BOTH an arrival and a payment, call BOTH tools in the same turn.
    - If necessary parameters are missing or ambiguous, pass reasonable defaults or note them in your final message.
    - After tools execute, confirm the actions taken clearly and concisely.
        `.trim()

    const contents: Content[] = [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ]

    let finalReply = ""
    const MAX_STEPS = 5
    let stepCount = 0

    while (stepCount < MAX_STEPS) {
      stepCount++

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents,
        config: {
          systemInstruction,
          tools: [
            {
              functionDeclarations: agentFunctionDeclarations,
            },
          ],
        },
      })

      const candidate = response.candidates?.[0]
      const parts = candidate?.content?.parts

      // Extract all function calls produced in this step
      const functionCalls =
        parts?.flatMap((part) =>
          part.functionCall ? [part.functionCall] : []
        ) ?? []

      // Terminal state: Model produced text without calling tools
      if (functionCalls.length === 0) {
        finalReply = response.text || "Action logged successfully."
        break
      }

      // Preserve model's thought step in conversation history
      if (candidate?.content) {
        contents.push(candidate.content)
      }

      // Execute tools
      for (const call of functionCalls) {
        const toolName = call.name ?? ""
        const toolArgs = call.args ?? {}

        let toolResult: AgentToolResult

        if (isSupportedTool(toolName)) {
          toolResult = await toolRegistry[toolName].execute(toolArgs)
        } else {
          toolResult = {
            success: false,
            error: `Unsupported tool call: ${toolName}`,
          }
        }

        traces.push({
          tool: toolName,
          args: toolArgs,
          result: toolResult,
        })

        // Provide execution output back to the model
        contents.push({
          role: "user",
          parts: [
            {
              functionResponse: {
                name: toolName,
                response: toolResult,
              },
            },
          ],
        })
      }
    }

    if (!finalReply) {
      finalReply =
        "Processed site update, but reached tool-loop execution limit."
    }

    // Get fresh data from database
    const [latestInventory, latestExpenses] = await Promise.all([
      db.select().from(inventory).orderBy(desc(inventory.id)).limit(10),
      db.select().from(expenses).orderBy(desc(expenses.id)).limit(10),
    ])

    const payload: AgentApiResponse = {
      reply: finalReply,
      traces,
      data: {
        inventory: latestInventory,
        expenses: latestExpenses,
      },
    }

    return NextResponse.json(payload, {
      status: 200,
    })
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal Server Error"
    console.error("[API_AGENT_ERROR]", err)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function GET() {
  try {
    const [latestInventory, latestExpenses] = await Promise.all([
      db.select().from(inventory).orderBy(desc(inventory.id)).limit(15),
      db.select().from(expenses).orderBy(desc(expenses.id)).limit(15),
    ])

    return NextResponse.json({
      data: {
        inventory: latestInventory,
        expenses: latestExpenses,
      },
    })
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch data"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
