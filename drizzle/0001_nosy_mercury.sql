ALTER TABLE `packages` ADD `name` text;--> statement-breakpoint
ALTER TABLE `packages` ADD `carrier` text;--> statement-breakpoint
ALTER TABLE `packages` ADD `tenant` text;--> statement-breakpoint
ALTER TABLE `packages` DROP COLUMN `data`;