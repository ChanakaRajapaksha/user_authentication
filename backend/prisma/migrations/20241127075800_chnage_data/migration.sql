/*
  Warnings:

  - You are about to alter the column `contactNumberMobile` on the `patient` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to alter the column `contactNumberWork` on the `patient` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE `patient` MODIFY `contactNumberMobile` VARCHAR(15) NOT NULL,
    MODIFY `contactNumberWork` VARCHAR(15) NULL;
