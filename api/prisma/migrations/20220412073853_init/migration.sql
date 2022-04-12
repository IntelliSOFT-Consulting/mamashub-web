/*
  Warnings:

  - Added the required column `names` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMINISTRATOR', 'STAFF', 'NURSE', 'PEDIATRICIAN', 'NURSE_COUNSELLOR', 'CLINICIAN', 'NUTRITIONIST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "names" TEXT NOT NULL,
ADD COLUMN     "role" "ROLE" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
