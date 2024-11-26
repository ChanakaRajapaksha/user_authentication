-- CreateTable
CREATE TABLE `Patient` (
    `patientId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(100) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `age` SMALLINT NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `nationality` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `maritalStatus` VARCHAR(20) NOT NULL,
    `visaType` VARCHAR(20) NOT NULL,
    `nationalId` VARCHAR(20) NOT NULL,
    `otherIdType` VARCHAR(50) NULL,
    `otherIdValue` VARCHAR(20) NULL,
    `mobileContactId` VARCHAR(191) NOT NULL,
    `workContactId` VARCHAR(191) NULL,

    PRIMARY KEY (`patientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactNumber` (
    `id` VARCHAR(191) NOT NULL,
    `countryCode` VARCHAR(5) NOT NULL,
    `number` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_mobileContactId_fkey` FOREIGN KEY (`mobileContactId`) REFERENCES `ContactNumber`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_workContactId_fkey` FOREIGN KEY (`workContactId`) REFERENCES `ContactNumber`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
