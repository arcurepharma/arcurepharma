CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255) DEFAULT '',
	"rating" integer DEFAULT 5 NOT NULL,
	"text" text NOT NULL,
	"image_url" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
