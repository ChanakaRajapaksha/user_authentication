-- AlterTable
ALTER TABLE `masteruser` ADD COLUMN `refreshToken` VARCHAR(255) NULL,
    ADD COLUMN `resetToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpiry` DATETIME(3) NULL;
