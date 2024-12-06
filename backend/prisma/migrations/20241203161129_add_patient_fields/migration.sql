-- AlterTable
ALTER TABLE `patient` ADD COLUMN `appointmentDate` DATETIME(3) NULL,
    ADD COLUMN `consultationReason` VARCHAR(255) NULL,
    ADD COLUMN `consultationType` VARCHAR(50) NULL,
    ADD COLUMN `doctorName` VARCHAR(100) NULL,
    ADD COLUMN `insurancePlan` VARCHAR(100) NULL,
    ADD COLUMN `paymentType` VARCHAR(50) NULL,
    ADD COLUMN `policyExpiryDate` DATETIME(3) NULL,
    ADD COLUMN `policyNumber` VARCHAR(50) NULL,
    ADD COLUMN `speciality` VARCHAR(50) NULL;
