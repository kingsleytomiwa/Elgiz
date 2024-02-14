-- AlterTable
ALTER TABLE "guests" ADD COLUMN     "suspended" BOOLEAN DEFAULT false;

-- DropEnum
DROP TYPE "RequestPaymentPlaceType";

-- DropEnum
DROP TYPE "RequestPaymentType";

-- DropEnum
DROP TYPE "RequestServeType";

-- DropEnum
DROP TYPE "RequestStatus";

-- CreateTable
CREATE TABLE "foodCategories" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "name" JSONB NOT NULL,

    CONSTRAINT "foodCategories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "foodCategories" ADD CONSTRAINT "foodCategories_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
