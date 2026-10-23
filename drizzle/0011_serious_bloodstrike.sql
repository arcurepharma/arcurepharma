CREATE TABLE "video_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) DEFAULT '',
	"customer_name" varchar(255) DEFAULT '',
	"video_url" text NOT NULL,
	"thumbnail_url" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
