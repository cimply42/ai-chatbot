-- CreateEnum
CREATE TYPE "ChatMessageType" AS ENUM ('BOT', 'USER');

-- CreateTable
CREATE TABLE "chat_sessions" (
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mac_address" TEXT NOT NULL,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "uuid" TEXT NOT NULL,
    "session_uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "type" "ChatMessageType" NOT NULL,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_uuid_fkey" FOREIGN KEY ("session_uuid") REFERENCES "chat_sessions"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
