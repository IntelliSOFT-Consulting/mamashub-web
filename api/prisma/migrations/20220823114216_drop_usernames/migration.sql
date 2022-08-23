/*
  Warnings:

  - You are about to drop the column `username` on the `Patient` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Patient_username_key";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "username";
