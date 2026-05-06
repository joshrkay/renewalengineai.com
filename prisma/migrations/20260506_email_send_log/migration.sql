-- CreateTable
CREATE TABLE "EmailSendLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "draftId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailSendLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmailSendLog_organizationId_sentAt_idx" ON "EmailSendLog"("organizationId", "sentAt");

-- CreateIndex
CREATE INDEX "EmailSendLog_policyId_idx" ON "EmailSendLog"("policyId");

-- AddForeignKey
ALTER TABLE "EmailSendLog" ADD CONSTRAINT "EmailSendLog_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailSendLog" ADD CONSTRAINT "EmailSendLog_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "RenewalDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
