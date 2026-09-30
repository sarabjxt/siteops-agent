CREATE SEQUENCE "expenses_id_seq";--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "id" SET DEFAULT nextval('expenses_id_seq')--> statement-breakpoint
ALTER SEQUENCE "expenses_id_seq" OWNED BY "public"."expenses"."id";--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "id" SET DATA TYPE int USING "id"::int;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "amount" SET DATA TYPE double precision USING "amount"::double precision;--> statement-breakpoint
CREATE SEQUENCE "inventory_id_seq";--> statement-breakpoint
ALTER TABLE "inventory" ALTER COLUMN "id" SET DEFAULT nextval('inventory_id_seq')--> statement-breakpoint
ALTER SEQUENCE "inventory_id_seq" OWNED BY "public"."inventory"."id";--> statement-breakpoint
ALTER TABLE "inventory" ALTER COLUMN "id" SET DATA TYPE int USING "id"::int;--> statement-breakpoint
ALTER TABLE "inventory" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "inventory" ALTER COLUMN "quantity" SET DATA TYPE double precision USING "quantity"::double precision;