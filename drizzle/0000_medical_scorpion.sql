CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(50) NOT NULL,
	"customer_name" varchar(255) DEFAULT '',
	"address" text NOT NULL,
	"landmark" varchar(255) DEFAULT '',
	"postal_code" varchar(20) DEFAULT '',
	"items" jsonb NOT NULL,
	"delivery_fee" numeric(10, 2) DEFAULT '0',
	"total_amount" numeric(10, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"description" text DEFAULT '',
	"category" varchar(100) DEFAULT 'General',
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sliders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" text NOT NULL,
	"title" varchar(255) DEFAULT '',
	"subtitle" varchar(500) DEFAULT '',
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
