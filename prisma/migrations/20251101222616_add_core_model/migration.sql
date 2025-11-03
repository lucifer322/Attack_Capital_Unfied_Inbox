/*
  Warnings:

  - The values [EDITOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `social` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `channel` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `direction` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `contactId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `isPrivate` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `channel` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `sendAt` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `Analytics` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Contact` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `body` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `title` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Note` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `date` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'VIEWER');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'VIEWER';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_contactId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_userId_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "social",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "channel",
DROP COLUMN "content",
DROP COLUMN "direction",
DROP COLUMN "timestamp",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "subject" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "contactId",
DROP COLUMN "isPrivate",
DROP COLUMN "updatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "channel",
DROP COLUMN "message",
DROP COLUMN "sendAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Analytics";

-- DropEnum
DROP TYPE "public"."Channel";

-- DropEnum
DROP TYPE "public"."Direction";

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
