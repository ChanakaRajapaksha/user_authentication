-- CreateTable
CREATE TABLE `NetworkLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `publicIp` VARCHAR(191) NOT NULL,
    `localIp` VARCHAR(191) NOT NULL,
    `macAddress` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `loggedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NetworkLog` ADD CONSTRAINT `NetworkLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
