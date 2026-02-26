-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN_CYRUS', 'CLIENT_USER');

-- CreateEnum
CREATE TYPE "RegType" AS ENUM ('LOI', 'DECRET', 'ARRETE');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('FAIBLE', 'MOYEN', 'CRITIQUE');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('CONFORME', 'NON_CONFORME', 'EN_COURS');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('A_FAIRE', 'EN_COURS', 'REALISEE', 'EN_RETARD');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "sector" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT_USER',
    "clientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regulation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "RegType" NOT NULL,
    "reference" TEXT,
    "ministry" TEXT,
    "authority" TEXT,
    "summary" TEXT,
    "publicationDate" TIMESTAMP(3),
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'MOYEN',
    "fileUrl" TEXT,

    CONSTRAINT "Regulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceMapping" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "regulationId" TEXT NOT NULL,
    "status" "ComplianceStatus" NOT NULL DEFAULT 'EN_COURS',
    "isApplicable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ComplianceMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionPlan" (
    "id" TEXT NOT NULL,
    "complianceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsibleUserId" TEXT,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "completionDate" TIMESTAMP(3),
    "status" "ActionStatus" NOT NULL DEFAULT 'A_FAIRE',
    "efficiencyMeasure" TEXT,

    CONSTRAINT "ActionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ComplianceMapping_clientId_regulationId_key" ON "ComplianceMapping"("clientId", "regulationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceMapping" ADD CONSTRAINT "ComplianceMapping_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceMapping" ADD CONSTRAINT "ComplianceMapping_regulationId_fkey" FOREIGN KEY ("regulationId") REFERENCES "Regulation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionPlan" ADD CONSTRAINT "ActionPlan_complianceId_fkey" FOREIGN KEY ("complianceId") REFERENCES "ComplianceMapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionPlan" ADD CONSTRAINT "ActionPlan_responsibleUserId_fkey" FOREIGN KEY ("responsibleUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
