ALTER TABLE "orders" ADD COLUMN "customer_last_name" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customer_phone2" varchar(50) DEFAULT '';--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "approved" integer DEFAULT 1 NOT NULL;