/*
  Warnings:

  - Made the column `appointmentDate` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `consultationType` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `doctorName` on table `patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `patient` MODIFY `appointmentDate` DATETIME(3) NOT NULL,
    MODIFY `consultationType` VARCHAR(50) NOT NULL,
    MODIFY `doctorName` VARCHAR(100) NOT NULL;
