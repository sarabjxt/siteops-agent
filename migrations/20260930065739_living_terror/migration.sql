CREATE TABLE "expenses" (
	"id" integer PRIMARY KEY,
	"category" text NOT NULL,
	"amount" integer NOT NULL,
	"paid_to" text,
	"payment_mode" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" integer PRIMARY KEY,
	"item" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit" text NOT NULL,
	"supplier" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
