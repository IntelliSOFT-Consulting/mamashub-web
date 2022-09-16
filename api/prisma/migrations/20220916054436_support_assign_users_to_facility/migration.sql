-- AlterTable
ALTER TABLE "User" ADD COLUMN     "facilityKmhflCode" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_facilityKmhflCode_fkey" FOREIGN KEY ("facilityKmhflCode") REFERENCES "Facility"("kmhflCode") ON DELETE SET NULL ON UPDATE CASCADE;
