/*
  Warnings:

  - Made the column `refreshToken` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `refreshToken` TEXT NOT NULL;
