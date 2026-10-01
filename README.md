# SiteOps Agent

> Autonomous construction ops agent built with TypeScript, Next.js App Router, and LLM tool calling.

Live Demo: **[https://siteops-agent.vercel.app/](https://siteops-agent.vercel.app/)**

---

## Key Features

- **Autonomous ReAct Tool Loop:** Implemented directly with `@google/genai` to handle model reasoning, tool invocations, state accumulation, and multi-turn closure.
- **Multi-Intent Parsing:** If a single message mentions both a delivery and an expense, the agent identifies and runs multiple distinct tools in the same turn.
- **End-to-End Type Safety:** Strict validation pipeline using **Zod** for runtime argument parsing and TypeScript type inference.
- **Live Execution Trace Inspector:** Visual, real-time UI log detailing exact model thought outputs, invoked tool names, parameter payloads, and database responses.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **AI / LLM:** Google Gen AI SDK (`@google/genai`)
- **Database & ORM:** PostgreSQL (Neon), Drizzle ORM
- **Validation:** Zod
- **UI & Styling:** Tailwind CSS, shadcn/ui
