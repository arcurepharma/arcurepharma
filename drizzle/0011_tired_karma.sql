CREATE TABLE "reels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_url" text NOT NULL,
	"title" varchar(255) DEFAULT '',
	"creator" varchar(255) DEFAULT '',
	"handle" varchar(255) DEFAULT '@arcurepharma',
	"product" varchar(255) DEFAULT '',
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "video_reviews" CASCADE;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "receipt_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "previous_price" numeric(10, 2);