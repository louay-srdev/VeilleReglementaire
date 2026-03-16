-- CreateEnum
CREATE TYPE "Domain" AS ENUM ('QUALITE', 'SECURITE', 'ENVIRONNEMENT', 'SST');

-- AlterTable
ALTER TABLE "Regulation" ADD COLUMN     "domain" "Domain";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "domain" "Domain";
