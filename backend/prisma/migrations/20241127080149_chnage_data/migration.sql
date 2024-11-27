/*
  Warnings:

  - The values [MALE,FEMALE] on the enum `Patient_gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `patient` MODIFY `gender` ENUM('Male', 'Female', 'Other') NOT NULL;
