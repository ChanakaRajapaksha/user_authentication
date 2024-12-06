/*
  Warnings:

  - You are about to drop the `otp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `otp` DROP FOREIGN KEY `Otp_userId_fkey`;

-- AlterTable
ALTER TABLE `patient` MODIFY `fullName` VARCHAR(100) NULL,
    MODIFY `dateOfBirth` DATETIME(3) NULL,
    MODIFY `age` SMALLINT NULL,
    MODIFY `gender` ENUM('Male', 'Female', 'Other') NULL,
    MODIFY `email` VARCHAR(50) NULL,
    MODIFY `nationalId` VARCHAR(20) NULL;

-- DropTable
DROP TABLE `otp`;
