-- AlterTable
ALTER TABLE `patient` MODIFY `fullName` VARCHAR(100) NULL,
    MODIFY `dateOfBirth` DATETIME(3) NULL,
    MODIFY `age` SMALLINT NULL,
    MODIFY `gender` ENUM('Male', 'Female', 'Other') NULL,
    MODIFY `nationalId` VARCHAR(20) NULL,
    MODIFY `contactNumberMobile` VARCHAR(15) NULL,
    MODIFY `appointmentDate` DATETIME(3) NULL,
    MODIFY `consultationType` VARCHAR(50) NULL,
    MODIFY `doctorName` VARCHAR(100) NULL;
