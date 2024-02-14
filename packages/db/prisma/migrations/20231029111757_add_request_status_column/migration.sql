/*
  Warnings:

  - Added the required column `status` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('CREATED', 'ACCEPTED', 'COMPLETED', 'REJECTED', 'WITHDRAWN');

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "status" "RequestStatus" NOT NULL;
