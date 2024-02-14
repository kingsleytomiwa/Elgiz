/*
  Warnings:

  - Added the required column `senderId` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "senderId" TEXT NOT NULL;
