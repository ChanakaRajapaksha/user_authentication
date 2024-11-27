/*
  Warnings:

  - You are about to drop the column `mobileContactId` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `workContactId` on the `patient` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Patient_mobileContactId_fkey` ON `patient`;

-- DropIndex
DROP INDEX `Patient_workContactId_fkey` ON `patient`;

-- AlterTable
ALTER TABLE `patient` DROP COLUMN `mobileContactId`,
    DROP COLUMN `workContactId`;
