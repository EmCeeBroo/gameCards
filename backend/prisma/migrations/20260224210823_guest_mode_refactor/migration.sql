-- DropForeignKey
ALTER TABLE `matches` DROP FOREIGN KEY `matches_player2_id_fkey`;

-- AlterTable
ALTER TABLE `matches` ADD COLUMN `winner_slot` INTEGER NULL,
    MODIFY `player2_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_player2_id_fkey` FOREIGN KEY (`player2_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
