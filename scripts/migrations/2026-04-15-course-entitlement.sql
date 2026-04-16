-- One-off migration for the cases-paywall branch (2026-04-15).
--
-- Adds two tables introduced by the course paywall work:
--
--   CourseEntitlement — per-org, per-course access grants written by the
--                       Stripe webhook on course purchases.
--   MastermindInvite  — email waitlist for the Mastermind community form.
--
-- This repo uses `prisma db push` rather than a migrations folder, so this
-- file is recorded here purely for audit / ops. You have two options to
-- apply it to production:
--
--   1. (Preferred, matches repo convention)
--        DATABASE_URL=<prod url> npx prisma db push
--      Prisma will diff the live schema against prisma/schema.prisma and
--      apply exactly the deltas below.
--
--   2. If you'd rather apply raw SQL by hand:
--        psql "$DATABASE_URL" -f scripts/migrations/2026-04-15-course-entitlement.sql
--
-- Either way, make sure a recent database backup is in place first.
-- Neither statement is destructive, but CREATE TABLE will fail if a table
-- with the same name already exists, so the `db push` path is safer.

-- CreateTable
CREATE TABLE "CourseEntitlement" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'stripe_checkout',
    "stripePriceId" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseEntitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MastermindInvite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "source" TEXT NOT NULL DEFAULT 'mastermind_page',
    "notes" TEXT,
    "contacted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MastermindInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseEntitlement_courseSlug_idx" ON "CourseEntitlement"("courseSlug");

-- CreateIndex
CREATE UNIQUE INDEX "CourseEntitlement_organizationId_courseSlug_key" ON "CourseEntitlement"("organizationId", "courseSlug");

-- CreateIndex
CREATE UNIQUE INDEX "MastermindInvite_email_key" ON "MastermindInvite"("email");

-- CreateIndex
CREATE INDEX "MastermindInvite_createdAt_idx" ON "MastermindInvite"("createdAt");

-- AddForeignKey
ALTER TABLE "CourseEntitlement" ADD CONSTRAINT "CourseEntitlement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
