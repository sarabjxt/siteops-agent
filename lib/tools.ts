import { FunctionDeclaration, Type } from "@google/genai"
import { db } from "@/db/drizzle"
import { expenses, inventory } from "@/db/schema"
import { z } from "zod"

export const recordInventoryArrivalSchema = z.object({
  item: z
    .string()
    .min(1)
    .describe(
      "Name of the construction material (e.g. Cement, TMT 12mm bar, Sand)"
    ),
  quantity: z.number().positive().describe("Numeric quantity received"),
  unit: z
    .string()
    .min(1)
    .describe("Unit of measurement (bags, tons, brass, pieces, trucks)"),
  supplier: z
    .string()
    .optional()
    .describe("Vendor, truck number, or supplier name if mentioned"),
})

export const recordSiteExpenseSchema = z.object({
  category: z
    .enum(["material", "labor", "equipment", "petty_cash", "fuel"])
    .describe("Expense category"),
  amount: z.number().positive().describe("Amount paid or due in INR"),
  paidTo: z
    .string()
    .optional()
    .describe("Recipient, mistri/labor contractor, or shop name"),
  paymentMode: z
    .enum(["cash", "upi", "bank_transfer", "credit"])
    .default("cash")
    .describe("Payment method"),
  notes: z
    .string()
    .optional()
    .describe("Short memo or context for the expenditure"),
})

export type RecordInventoryArrivalArgs = z.infer<
  typeof recordInventoryArrivalSchema
>
export type RecordSiteExpenseArgs = z.infer<typeof recordSiteExpenseSchema>

export type InventoryToolResult = {
  success: true
  action: "INSERT_INVENTORY"
  id: number
  item: string
  quantity: number
  unit: string
  supplier: string
}

export type ExpenseToolResult = {
  success: true
  action: "INSERT_EXPENSE"
  id: number
  category: string
  amount: number
  paidTo: string
  paymentMode: string
}

export type ToolFailureResult = {
  success: false
  error: string
}

export type AgentToolResult =
  InventoryToolResult | ExpenseToolResult | ToolFailureResult

export const agentFunctionDeclarations: FunctionDeclaration[] = [
  {
    name: "recordInventoryArrival",
    description: "Logs arriving construction materials to site inventory.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        item: {
          type: Type.STRING,
          description:
            "Name of the construction material (e.g. Cement, TMT 12mm bar, Sand)",
        },
        quantity: {
          type: Type.NUMBER,
          description: "Numeric quantity received",
        },
        unit: {
          type: Type.STRING,
          description:
            "Unit of measurement (bags, tons, brass, pieces, trucks)",
        },
        supplier: {
          type: Type.STRING,
          description: "Vendor, truck number, or supplier name if mentioned",
        },
      },
      required: ["item", "quantity", "unit"],
    },
  },
  {
    name: "recordSiteExpense",
    description:
      "Records money paid out or expenses incurred on site (labor, materials, diesel, petty cash).",
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          enum: ["material", "labor", "equipment", "petty_cash", "fuel"],
          description: "Expense category",
        },
        amount: {
          type: Type.NUMBER,
          description: "Amount paid or due in INR",
        },
        paidTo: {
          type: Type.STRING,
          description: "Recipient, mistri/labor contractor, or shop name",
        },
        paymentMode: {
          type: Type.STRING,
          enum: ["cash", "upi", "bank_transfer", "credit"],
          description: "Payment method",
        },
        notes: {
          type: Type.STRING,
          description: "Short memo or context for the expenditure",
        },
      },
      required: ["category", "amount"],
    },
  },
]

export const toolRegistry = {
  recordInventoryArrival: {
    schema: recordInventoryArrivalSchema,
    execute: async (
      rawArgs: unknown
    ): Promise<InventoryToolResult | ToolFailureResult> => {
      const parsed = recordInventoryArrivalSchema.safeParse(rawArgs)
      if (!parsed.success) {
        return {
          success: false,
          error: `Invalid arguments: ${parsed.error.message}`,
        }
      }
      const data = parsed.data
      const [row] = await db
        .insert(inventory)
        .values({
          item: data.item,
          quantity: data.quantity,
          unit: data.unit,
          supplier: data.supplier ?? "Unspecified",
        })
        .returning({
          id: inventory.id,
        })

      return {
        success: true,
        action: "INSERT_INVENTORY",
        id: row.id,
        item: data.item,
        quantity: data.quantity,
        unit: data.unit,
        supplier: data.supplier ?? "Unspecified",
      }
    },
  },
  recordSiteExpense: {
    schema: recordSiteExpenseSchema,
    execute: async (
      rawArgs: unknown
    ): Promise<ExpenseToolResult | ToolFailureResult> => {
      const parsed = recordSiteExpenseSchema.safeParse(rawArgs)
      if (!parsed.success) {
        return {
          success: false,
          error: `Invalid arguments: ${parsed.error.message}`,
        }
      }
      const data = parsed.data

      const [row] = await db
        .insert(expenses)
        .values({
          amount: data.amount,
          category: data.category,
          paidTo: data.paidTo ?? "Direct Expense",
          paymentMode: data.paymentMode,
          notes: data.notes ?? "",
        })
        .returning({
          id: expenses.id,
        })

      return {
        success: true,
        action: "INSERT_EXPENSE",
        id: row.id,
        category: data.category,
        amount: data.amount,
        paidTo: data.paidTo ?? "Direct Expense",
        paymentMode: data.paymentMode,
      }
    },
  },
} as const

export type SupportedToolName = keyof typeof toolRegistry

export function isSupportedTool(name: string): name is SupportedToolName {
  return name in toolRegistry
}

export function getToolName(tool: SupportedToolName) {
  return tool
}
