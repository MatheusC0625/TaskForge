-- CreateTable
CREATE TABLE "ProjectRepo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectRepo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectRepo_projectId_idx" ON "ProjectRepo"("projectId");

-- AddForeignKey
ALTER TABLE "ProjectRepo" ADD CONSTRAINT "ProjectRepo_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: move existing single githubRepoUrl values into ProjectRepo rows
INSERT INTO "ProjectRepo" ("id", "url", "projectId", "createdAt")
SELECT gen_random_uuid()::text, "githubRepoUrl", "id", CURRENT_TIMESTAMP
FROM "Project"
WHERE "githubRepoUrl" IS NOT NULL;

-- DropColumn
ALTER TABLE "Project" DROP COLUMN "githubRepoUrl";
