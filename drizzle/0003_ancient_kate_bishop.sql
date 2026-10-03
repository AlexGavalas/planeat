CREATE TABLE "meal_reminder_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"local_date" date NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" bigint NOT NULL,
	CONSTRAINT "meal_reminder_deliveries_user_id_local_date_unique" UNIQUE("user_id","local_date")
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"meal_reminder_enabled" boolean DEFAULT false NOT NULL,
	"meal_reminder_time" time DEFAULT '20:00:00' NOT NULL,
	"next_notification_at" timestamp with time zone,
	"timezone" text NOT NULL,
	"user_id" bigint PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"auth" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"endpoint" text NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"p256dh" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" bigint NOT NULL,
	CONSTRAINT "push_subscriptions_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
ALTER TABLE "meals" ALTER COLUMN "day" SET DATA TYPE date USING ("day" AT TIME ZONE 'UTC')::date;--> statement-breakpoint
ALTER TABLE "meal_reminder_deliveries" ADD CONSTRAINT "meal_reminder_deliveries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "push_subscriptions_user_id_idx" ON "push_subscriptions" USING btree ("user_id");
