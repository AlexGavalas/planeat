CREATE TABLE "weekly_meal_zones" (
	"day" date NOT NULL,
	"label" text NOT NULL,
	"legacy_key" text,
	"position" integer NOT NULL,
	"time" time NOT NULL,
	"user_id" bigint NOT NULL,
	"week_start" date NOT NULL,
	"zone_key" text NOT NULL,
	CONSTRAINT "weekly_meal_zones_user_week_zone_pk" PRIMARY KEY("user_id","week_start","zone_key"),
	CONSTRAINT "weekly_meal_zones_user_day_position_unique" UNIQUE("user_id","day","position")
);
--> statement-breakpoint
ALTER TABLE "weekly_meal_zones" ADD CONSTRAINT "weekly_meal_zones_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "weekly_meal_zones_user_week_idx" ON "weekly_meal_zones" USING btree ("user_id","week_start");