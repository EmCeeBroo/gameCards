-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('PLAYER', 'ADMIN') NOT NULL DEFAULT 'PLAYER',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `races` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `powers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) NOT NULL,
    `value` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spells` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) NULL,
    `value` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warriors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `race_id` INTEGER NOT NULL,
    `power_id` INTEGER NOT NULL,
    `spell_id` INTEGER NOT NULL,
    `image_url` VARCHAR(255) NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mode` ENUM('ONE_VS_ONE', 'THREE_VS_THREE', 'FIVE_VS_FIVE') NOT NULL DEFAULT 'FIVE_VS_FIVE',
    `status` ENUM('WAITING', 'SELECTING', 'IN_PROGRESS', 'FINISHED') NOT NULL DEFAULT 'WAITING',
    `player1_id` INTEGER NOT NULL,
    `player2_id` INTEGER NOT NULL,
    `winner_id` INTEGER NULL,
    `reason_for_win` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_selections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `match_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `warrior_id` INTEGER NOT NULL,
    `player_slot` INTEGER NOT NULL,
    `selected_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `player_selections_match_id_player_slot_warrior_id_key`(`match_id`, `player_slot`, `warrior_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `warriors` ADD CONSTRAINT `warriors_race_id_fkey` FOREIGN KEY (`race_id`) REFERENCES `races`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warriors` ADD CONSTRAINT `warriors_power_id_fkey` FOREIGN KEY (`power_id`) REFERENCES `powers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warriors` ADD CONSTRAINT `warriors_spell_id_fkey` FOREIGN KEY (`spell_id`) REFERENCES `spells`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_player1_id_fkey` FOREIGN KEY (`player1_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_player2_id_fkey` FOREIGN KEY (`player2_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_winner_id_fkey` FOREIGN KEY (`winner_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_selections` ADD CONSTRAINT `player_selections_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_selections` ADD CONSTRAINT `player_selections_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_selections` ADD CONSTRAINT `player_selections_warrior_id_fkey` FOREIGN KEY (`warrior_id`) REFERENCES `warriors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
