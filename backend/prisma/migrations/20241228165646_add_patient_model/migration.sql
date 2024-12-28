/*
  Warnings:

  - The primary key for the `patient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `appointmentDate` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `consultationReason` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `consultationType` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `contactNumberMobile` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `contactNumberWork` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `customFields` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceCardNumber` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `insurancePlan` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceProvider` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceSubProvider` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `otherIdType` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `otherIdValue` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `policyExpiryDate` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `policyNumber` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `speciality` on the `patient` table. All the data in the column will be lost.
  - You are about to alter the column `age` on the `patient` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `VarChar(191)`.
  - You are about to drop the `staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff_dynamic_fields` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mrdNumber]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dob` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Patient` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `mrdNumber` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientFullName` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Made the column `gender` on table `patient` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `staff_dynamic_fields` DROP FOREIGN KEY `staff_dynamic_fields_dynamicFieldId_fkey`;

-- DropForeignKey
ALTER TABLE `staff_dynamic_fields` DROP FOREIGN KEY `staff_dynamic_fields_staff_id_fkey`;

-- DropIndex
DROP INDEX `Patient_email_key` ON `patient`;

-- DropIndex
DROP INDEX `Patient_nationalId_key` ON `patient`;

-- AlterTable
ALTER TABLE `patient` DROP PRIMARY KEY,
    DROP COLUMN `appointmentDate`,
    DROP COLUMN `consultationReason`,
    DROP COLUMN `consultationType`,
    DROP COLUMN `contactNumberMobile`,
    DROP COLUMN `contactNumberWork`,
    DROP COLUMN `customFields`,
    DROP COLUMN `dateOfBirth`,
    DROP COLUMN `email`,
    DROP COLUMN `fullName`,
    DROP COLUMN `insuranceCardNumber`,
    DROP COLUMN `insurancePlan`,
    DROP COLUMN `insuranceProvider`,
    DROP COLUMN `insuranceSubProvider`,
    DROP COLUMN `otherIdType`,
    DROP COLUMN `otherIdValue`,
    DROP COLUMN `patientId`,
    DROP COLUMN `policyExpiryDate`,
    DROP COLUMN `policyNumber`,
    DROP COLUMN `speciality`,
    ADD COLUMN `address` VARCHAR(500) NULL,
    ADD COLUMN `alert` VARCHAR(191) NULL,
    ADD COLUMN `area` VARCHAR(191) NULL,
    ADD COLUMN `companyName` VARCHAR(70) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `district` VARCHAR(191) NULL,
    ADD COLUMN `dob` DATETIME(3) NOT NULL,
    ADD COLUMN `emNumber` VARCHAR(15) NULL,
    ADD COLUMN `emPerson` VARCHAR(100) NULL,
    ADD COLUMN `emailId` VARCHAR(50) NULL,
    ADD COLUMN `emirates` VARCHAR(191) NULL,
    ADD COLUMN `empId` VARCHAR(20) NULL,
    ADD COLUMN `encounterType` VARCHAR(191) NULL,
    ADD COLUMN `existing` VARCHAR(191) NULL,
    ADD COLUMN `hasanaId` VARCHAR(20) NULL,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `idNumber` VARCHAR(20) NULL,
    ADD COLUMN `idType` VARCHAR(191) NULL,
    ADD COLUMN `infoSource` VARCHAR(191) NULL,
    ADD COLUMN `landPhone` VARCHAR(15) NULL,
    ADD COLUMN `mainDistrict` VARCHAR(191) NULL,
    ADD COLUMN `mobile` VARCHAR(15) NULL,
    ADD COLUMN `mrdNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `occupation` VARCHAR(50) NULL,
    ADD COLUMN `patientFullName` VARCHAR(100) NOT NULL,
    ADD COLUMN `patientPriority` VARCHAR(191) NULL,
    ADD COLUMN `patientRemark` VARCHAR(500) NULL,
    ADD COLUMN `patientType` VARCHAR(191) NULL,
    ADD COLUMN `place` VARCHAR(50) NULL,
    ADD COLUMN `preferredLanguage` VARCHAR(191) NULL,
    ADD COLUMN `referralCase` VARCHAR(191) NULL,
    ADD COLUMN `referredBy` VARCHAR(100) NULL,
    ADD COLUMN `registrationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `relationship` VARCHAR(20) NULL,
    ADD COLUMN `specialty` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `visitType` VARCHAR(191) NOT NULL DEFAULT 'Consultation',
    ADD COLUMN `wMobile` VARCHAR(15) NULL,
    ADD COLUMN `work` VARCHAR(15) NULL,
    MODIFY `age` VARCHAR(191) NULL,
    MODIFY `gender` VARCHAR(191) NOT NULL,
    MODIFY `nationality` VARCHAR(191) NULL,
    MODIFY `maritalStatus` VARCHAR(191) NULL,
    MODIFY `visaType` VARCHAR(191) NULL,
    MODIFY `doctorName` VARCHAR(191) NULL,
    MODIFY `paymentType` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `staff`;

-- DropTable
DROP TABLE `staff_dynamic_fields`;

-- CreateTable
CREATE TABLE `patient_dynamic_field` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` VARCHAR(191) NOT NULL,
    `dynamicFieldId` INTEGER NOT NULL,
    `value` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Patient_id_key` ON `Patient`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Patient_mrdNumber_key` ON `Patient`(`mrdNumber`);

-- AddForeignKey
ALTER TABLE `patient_dynamic_field` ADD CONSTRAINT `patient_dynamic_field_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_dynamic_field` ADD CONSTRAINT `patient_dynamic_field_dynamicFieldId_fkey` FOREIGN KEY (`dynamicFieldId`) REFERENCES `dynamic_fields`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
