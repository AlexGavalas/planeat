CREATE TABLE "meal_zone_times" (
	"effective_from" date NOT NULL,
	"time" time NOT NULL,
	"user_id" bigint NOT NULL,
	"zone_key" text NOT NULL,
	CONSTRAINT "meal_zone_times_user_effective_zone_pk" PRIMARY KEY("user_id","effective_from","zone_key")
);
--> statement-breakpoint
ALTER TABLE "meal_zone_times" ADD CONSTRAINT "meal_zone_times_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "meal_zone_times_user_effective_idx" ON "meal_zone_times" USING btree ("user_id","effective_from");