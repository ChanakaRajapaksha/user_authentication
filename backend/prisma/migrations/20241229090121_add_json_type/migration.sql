/*
  Warnings:

  - You are about to alter the column `preferredLanguage` on the `patient` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `patient` MODIFY `preferredLanguage` JSON NULL;
