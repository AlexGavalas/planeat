CREATE TABLE "professional_clients" (
	"accepted_at" timestamp with time zone,
	"client_user_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"professional_user_id" bigint NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	CONSTRAINT "professional_clients_professional_client_unique" UNIQUE("professional_user_id","client_user_id")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"is_discoverable" boolean DEFAULT false NOT NULL,
	"role" text NOT NULL,
	"user_id" bigint NOT NULL,
	CONSTRAINT "user_roles_user_id_role_pk" PRIMARY KEY("user_id","role")
);
--> statement-breakpoint
ALTER TABLE "professional_clients" ADD CONSTRAINT "professional_clients_client_user_id_users_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_clients" ADD CONSTRAINT "professional_clients_professional_user_id_users_id_fk" FOREIGN KEY ("professional_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "professional_clients_one_active_professional_idx" ON "professional_clients" USING btree ("client_user_id") WHERE "professional_clients"."status" = 'active';--> statement-breakpoint
CREATE INDEX "professional_clients_professional_status_idx" ON "professional_clients" USING btree ("professional_user_id","status");--> statement-breakpoint
CREATE INDEX "professional_clients_client_status_idx" ON "professional_clients" USING btree ("client_user_id","status");--> statement-breakpoint
CREATE INDEX "user_roles_role_discoverable_idx" ON "user_roles" USING btree ("role","is_discoverable");