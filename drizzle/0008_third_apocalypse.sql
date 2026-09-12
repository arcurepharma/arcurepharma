CREATE TABLE "chat_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_phone" varchar(50) NOT NULL,
	"user_name" varchar(255) DEFAULT '',
	"user_email" varchar(255) DEFAULT '',
	"messages" jsonb DEFAULT '[]'::jsonb,
	"order_id" uuid,
	"status" varchar(50) DEFAULT 'Active' NOT NULL,
	"conversation_type" varchar(50) DEFAULT 'Support' NOT NULL,
	"shifted_to_whatsapp" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;