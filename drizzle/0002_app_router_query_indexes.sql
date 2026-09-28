CREATE INDEX "activities_user_id_date_idx" ON "activities" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "connections_user_id_idx" ON "connections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "meals_user_id_day_idx" ON "meals" USING btree ("user_id","day");--> statement-breakpoint
CREATE INDEX "measurements_user_id_date_idx" ON "measurements" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "notifications_target_user_id_notification_type_idx" ON "notifications" USING btree ("target_user_id","notification_type");