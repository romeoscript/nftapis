/*
  Warnings:

  - You are about to drop the column `walletId` on the `Purchase` table. All the data in the column will be lost.
  - Added the required column `address` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_walletId_fkey";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "walletId",
ADD COLUMN     "address" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_address_fkey" FOREIGN KEY ("address") REFERENCES "WalletUser"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
