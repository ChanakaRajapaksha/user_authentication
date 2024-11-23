/*
  Warnings:

  - You are about to drop the `otp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `otp` DROP FOREIGN KEY `Otp_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `otp` INTEGER NULL,
    ADD COLUMN `otpExpiry` DATETIME(3) NULL;

-- DropTable
DROP TABLE `otp`;
