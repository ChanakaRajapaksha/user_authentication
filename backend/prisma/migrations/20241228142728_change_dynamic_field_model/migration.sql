/*
  Warnings:

  - Added the required column `category` to the `dynamic_fields` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dynamic_fields` ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `is_required` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `radio_buttons` VARCHAR(191) NULL;
