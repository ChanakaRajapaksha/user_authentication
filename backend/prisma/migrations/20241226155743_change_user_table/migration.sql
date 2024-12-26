/*
  Warnings:

  - You are about to drop the column `name` on the `masteruser` table. All the data in the column will be lost.
  - Added the required column `username` to the `masterUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `masteruser` DROP COLUMN `name`,
    ADD COLUMN `username` VARCHAR(100) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `refreshToken` VARCHAR(255) NULL;
