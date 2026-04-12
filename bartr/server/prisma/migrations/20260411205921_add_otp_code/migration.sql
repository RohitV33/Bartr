-- AlterTable
ALTER TABLE "EmailVerification" ADD COLUMN     "otp_code" TEXT;

-- CreateIndex
CREATE INDEX "EmailVerification_user_id_idx" ON "EmailVerification"("user_id");
