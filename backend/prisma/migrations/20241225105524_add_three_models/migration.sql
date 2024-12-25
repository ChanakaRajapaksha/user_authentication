-- CreateTable
CREATE TABLE `staff` (
    `staffId` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `specialist` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `fatherName` VARCHAR(191) NULL,
    `motherName` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NOT NULL,
    `maritalStatus` VARCHAR(191) NULL,
    `bloodGroup` VARCHAR(191) NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `dateOfJoining` DATETIME(3) NULL,
    `phone` VARCHAR(191) NULL,
    `emergencyContact` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NULL,
    `currentAddress` VARCHAR(191) NULL,
    `permanentAddress` VARCHAR(191) NULL,
    `qualification` VARCHAR(191) NULL,
    `workExperience` VARCHAR(191) NULL,
    `specialization` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `panNumber` VARCHAR(191) NULL,
    `nationalIDNumber` VARCHAR(191) NULL,
    `localIDNumber` VARCHAR(191) NULL,
    `referenceContact` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `staff_staffId_key`(`staffId`),
    UNIQUE INDEX `staff_email_key`(`email`),
    PRIMARY KEY (`staffId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staff_dynamic_fields` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `staff_id` VARCHAR(191) NOT NULL,
    `dynamicFieldId` INTEGER NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dynamic_fields` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `field_name` VARCHAR(191) NOT NULL,
    `field_type` VARCHAR(191) NOT NULL,
    `dropdown_options` VARCHAR(191) NULL,

    UNIQUE INDEX `dynamic_fields_field_name_key`(`field_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `staff_dynamic_fields` ADD CONSTRAINT `staff_dynamic_fields_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staffId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `staff_dynamic_fields` ADD CONSTRAINT `staff_dynamic_fields_dynamicFieldId_fkey` FOREIGN KEY (`dynamicFieldId`) REFERENCES `dynamic_fields`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
