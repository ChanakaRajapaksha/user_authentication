/*
  Warnings:

  - You are about to alter the column `consultationReason` on the `patient` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(200)`.
  - You are about to alter the column `insurancePlan` on the `patient` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `patient` ADD COLUMN `insuranceCardNumber` VARCHAR(50) NULL,
    ADD COLUMN `insuranceProvider` VARCHAR(100) NULL,
    ADD COLUMN `insuranceSubProvider` VARCHAR(100) NULL,
    MODIFY `consultationReason` VARCHAR(200) NULL,
    MODIFY `insurancePlan` VARCHAR(50) NULL;
