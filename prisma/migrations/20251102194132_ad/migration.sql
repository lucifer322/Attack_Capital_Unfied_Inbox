/*
  Warnings:

  - Added the required column `channelType` to the `TwilioAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TwilioAccount" ADD COLUMN     "channelType" TEXT NOT NULL;
