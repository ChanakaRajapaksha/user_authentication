/*
  Warnings:

  - Added the required column `branch` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `branch` VARCHAR(191) NOT NULL;
