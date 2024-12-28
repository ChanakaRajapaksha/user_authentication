/*
  Warnings:

  - Made the column `age` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nationality` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maritalStatus` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `visaType` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nationalId` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `doctorName` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paymentType` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `area` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companyName` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `district` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emailId` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emirates` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `existing` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idNumber` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idType` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `infoSource` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mainDistrict` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mobile` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `occupation` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `patientPriority` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `place` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `specialty` on table `patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `patient` ADD COLUMN `corporateName` VARCHAR(191) NULL,
    MODIFY `age` VARCHAR(191) NOT NULL,
    MODIFY `nationality` VARCHAR(191) NOT NULL,
    MODIFY `maritalStatus` VARCHAR(191) NOT NULL,
    MODIFY `visaType` VARCHAR(191) NOT NULL,
    MODIFY `nationalId` VARCHAR(20) NOT NULL,
    MODIFY `doctorName` VARCHAR(191) NOT NULL,
    MODIFY `paymentType` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(500) NOT NULL,
    MODIFY `area` VARCHAR(191) NOT NULL,
    MODIFY `companyName` VARCHAR(70) NOT NULL,
    MODIFY `district` VARCHAR(191) NOT NULL,
    MODIFY `emailId` VARCHAR(50) NOT NULL,
    MODIFY `emirates` VARCHAR(191) NOT NULL,
    MODIFY `existing` VARCHAR(191) NOT NULL,
    MODIFY `idNumber` VARCHAR(20) NOT NULL,
    MODIFY `idType` VARCHAR(191) NOT NULL,
    MODIFY `infoSource` VARCHAR(191) NOT NULL,
    MODIFY `mainDistrict` VARCHAR(191) NOT NULL,
    MODIFY `mobile` VARCHAR(15) NOT NULL,
    MODIFY `occupation` VARCHAR(50) NOT NULL,
    MODIFY `patientPriority` VARCHAR(191) NOT NULL,
    MODIFY `place` VARCHAR(50) NOT NULL,
    MODIFY `registrationDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `specialty` VARCHAR(191) NOT NULL;
