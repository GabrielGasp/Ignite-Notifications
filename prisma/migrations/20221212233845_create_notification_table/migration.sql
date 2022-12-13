-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "recipient_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_recipient_id_idx" ON "Notification"("recipient_id");
