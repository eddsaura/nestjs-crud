/*
  Warnings:

  - The primary key for the `articles` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "articles" DROP CONSTRAINT "articles_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "articles_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "articles_id_seq";
