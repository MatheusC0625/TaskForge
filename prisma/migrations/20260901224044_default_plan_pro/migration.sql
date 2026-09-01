-- AlterTable: novas contas nascem no plano PRO (portfólio, sem cobrança real)
ALTER TABLE "User" ALTER COLUMN "plan" SET DEFAULT 'PRO';

-- Libera o PRO também para contas já existentes, para demonstração
UPDATE "User" SET "plan" = 'PRO' WHERE "plan" = 'FREE';
