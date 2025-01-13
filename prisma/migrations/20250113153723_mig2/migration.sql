/*
  Warnings:

  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.
  - Added the required column `ownerID` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "ownerID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
