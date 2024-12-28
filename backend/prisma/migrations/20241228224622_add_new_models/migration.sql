-- CreateTable
CREATE TABLE `Insurance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `insuranceProvider` VARCHAR(191) NOT NULL,
    `subInsurance` VARCHAR(191) NOT NULL,
    `networkType` VARCHAR(191) NOT NULL,
    `insuranceCardNumber` VARCHAR(20) NOT NULL,
    `extraCardNumber` VARCHAR(20) NULL,
    `insuranceEffectiveDate` DATETIME(3) NOT NULL,
    `insuranceExpiryDate` DATETIME(3) NOT NULL,
    `certificateNo` VARCHAR(20) NOT NULL,
    `dependentsNo` TINYINT NOT NULL DEFAULT 0,
    `insuranceClaimNo` VARCHAR(20) NULL,
    `maxInsuranceLiability` DECIMAL(20, 2) NOT NULL,
    `insuranceApprovalLimit` DECIMAL(20, 2) NOT NULL,
    `maxInsuranceCoPay` DECIMAL(20, 2) NOT NULL,
    `coPayPatient` DECIMAL(20, 2) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Deductible` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `insuranceId` INTEGER NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `deductible` DECIMAL(20, 2) NULL,
    `deductibleType` ENUM('all', 'each') NOT NULL,
    `copay` DECIMAL(20, 2) NULL,
    `copayType` ENUM('all', 'each') NOT NULL,
    `min` DECIMAL(20, 2) NULL,
    `max` DECIMAL(20, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Insurance` ADD CONSTRAINT `Insurance_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deductible` ADD CONSTRAINT `Deductible_insuranceId_fkey` FOREIGN KEY (`insuranceId`) REFERENCES `Insurance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
