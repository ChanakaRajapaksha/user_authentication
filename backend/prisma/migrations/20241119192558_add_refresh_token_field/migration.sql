/*
  Warnings:

  - You are about to drop the `refreshtoken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `refreshtoken` DROP FOREIGN KEY `RefreshToken_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `refreshToken` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `refreshtoken`;
