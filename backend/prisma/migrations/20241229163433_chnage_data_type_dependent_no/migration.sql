/*
  Warnings:

  - You are about to alter the column `dependentsNo` on the `insurance` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(2)`.

*/
-- AlterTable
ALTER TABLE `insurance` MODIFY `dependentsNo` VARCHAR(2) NOT NULL;
