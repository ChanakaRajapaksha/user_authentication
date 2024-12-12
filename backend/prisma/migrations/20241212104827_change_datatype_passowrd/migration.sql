/*
  Warnings:

  - You are about to drop the column `password` on the `masteruser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `masteruser` DROP COLUMN `password`,
    ADD COLUMN `masterPassword` VARCHAR(191) NULL;
