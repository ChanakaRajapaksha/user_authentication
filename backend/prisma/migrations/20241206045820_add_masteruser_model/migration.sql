-- CreateTable
CREATE TABLE `masterUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empId` VARCHAR(20) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `mobile` VARCHAR(15) NOT NULL,
    `branch` VARCHAR(50) NOT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `masterUser_empId_key`(`empId`),
    UNIQUE INDEX `masterUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
