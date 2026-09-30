import type { ToolExecutionTrace } from "@/app/api/agent/route"
import type { expenses, inventory } from "@/db/schema"

export type InventoryRow = typeof inventory.$inferSelect
export type ExpenseRow = typeof expenses.$inferSelect

export interface ChatMessage {
  id: string
  sender: "user" | "agent"
  text: string
  timestamp: string
  isError?: boolean
}

export interface PromptItem {
  id: string
  title: string
  category: "Material Delivery" | "Labor & Petty Cash" | "Credit Supply" | "Fuel & Machinery"
  prompt: string
}

export const SAMPLE_PROMPTS: PromptItem[] = [
  {
    id: "sample-1",
    title: "Cement Delivery + Cash Payment",
    category: "Material Delivery",
    prompt: "Aaj 60 bag UltraTech cement aayi from Sharma Traders, ₹21,000 cash diya",
  },
  {
    id: "sample-2",
    title: "Labor Contractor UPI Payment",
    category: "Labor & Petty Cash",
    prompt: "Paid ₹4,500 via UPI to tile mistri for 2nd floor slab plastering",
  },
  {
    id: "sample-3",
    title: "TMT Steel Credit Supply",
    category: "Credit Supply",
    prompt: "Received 3.5 tons of 12mm TMT steel bars from Jindal Steels on credit",
  },
  {
    id: "sample-4",
    title: "Diesel Expense for Generator",
    category: "Fuel & Machinery",
    prompt: "Site petty cash expense: ₹1,200 diesel for concrete mixer generator",
  },
]

export type { ToolExecutionTrace }
