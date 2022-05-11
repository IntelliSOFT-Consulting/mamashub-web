-- AlterTable
ALTER TABLE "User" ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{ "newUser": true }';
