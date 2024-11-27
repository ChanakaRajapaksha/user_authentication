/*
  Warnings:

  - You are about to drop the `contactnumber` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contactNumberMobile` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `patient` DROP FOREIGN KEY `Patient_mobileContactId_fkey`;

-- DropForeignKey
ALTER TABLE `patient` DROP FOREIGN KEY `Patient_workContactId_fkey`;

-- AlterTable
ALTER TABLE `patient` ADD COLUMN `contactNumberMobile` VARCHAR(191) NOT NULL,
    ADD COLUMN `contactNumberWork` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `contactnumber`;
