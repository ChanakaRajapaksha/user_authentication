/*
  Warnings:

  - Added the required column `masterUserId` to the `NetworkLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `networklog` ADD COLUMN `masterUserId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `NetworkLog` ADD CONSTRAINT `NetworkLog_masterUserId_fkey` FOREIGN KEY (`masterUserId`) REFERENCES `masterUser`(`empId`) ON DELETE CASCADE ON UPDATE CASCADE;
