/*
  Warnings:

  - Made the column `fullName` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateOfBirth` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `age` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nationality` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nationalId` on table `patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `patient` MODIFY `fullName` VARCHAR(100) NOT NULL,
    MODIFY `dateOfBirth` DATETIME(3) NOT NULL,
    MODIFY `age` SMALLINT NOT NULL,
    MODIFY `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
    MODIFY `nationality` VARCHAR(50) NOT NULL,
    MODIFY `nationalId` VARCHAR(20) NOT NULL;
