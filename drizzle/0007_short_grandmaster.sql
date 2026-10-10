CREATE TABLE "meal_items" (
	"alternative_name" text,
	"basis_grams" double precision DEFAULT 100 NOT NULL,
	"brand" text,
	"calories" double precision,
	"carbohydrates" double precision,
	"fat" double precision,
	"fiber" double precision,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meal_id" uuid NOT NULL,
	"name" text NOT NULL,
	"position" integer NOT NULL,
	"protein" double precision,
	"provider_food_id" text NOT NULL,
	"quantity_grams" double precision NOT NULL,
	"salt" double precision,
	"source" text NOT NULL,
	"sugar" double precision
);
--> statement-breakpoint
CREATE TABLE "meal_pool_items" (
	"alternative_name" text,
	"basis_grams" double precision DEFAULT 100 NOT NULL,
	"brand" text,
	"calories" double precision,
	"carbohydrates" double precision,
	"fat" double precision,
	"fiber" double precision,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meal_pool_id" bigint NOT NULL,
	"name" text NOT NULL,
	"position" integer NOT NULL,
	"protein" double precision,
	"provider_food_id" text NOT NULL,
	"quantity_grams" double precision NOT NULL,
	"salt" double precision,
	"source" text NOT NULL,
	"sugar" double precision
);
--> statement-breakpoint
ALTER TABLE "meal_items" ADD CONSTRAINT "meal_items_meal_id_meals_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_pool_items" ADD CONSTRAINT "meal_pool_items_meal_pool_id_meals_pool_id_fk" FOREIGN KEY ("meal_pool_id") REFERENCES "public"."meals_pool"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "meal_items_meal_id_idx" ON "meal_items" USING btree ("meal_id");--> statement-breakpoint
CREATE INDEX "meal_pool_items_meal_pool_id_idx" ON "meal_pool_items" USING btree ("meal_pool_id");