CREATE TABLE "complaints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) DEFAULT '',
	"email" varchar(255) NOT NULL,
	"order_id" varchar(255) DEFAULT '',
	"subject" varchar(255) DEFAULT '',
	"message" text NOT NULL,
	"status" varchar(50) DEFAULT 'Open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
