/*
  Warnings:

  - You are about to drop the column `email` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiresAt` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `salt` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `patientId` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Patient_email_key";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "email",
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiresAt",
DROP COLUMN "salt",
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3),
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "patientId" SET NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phone_key" ON "Patient"("phone");
