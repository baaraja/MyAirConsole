-- DropForeignKey
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Player" DROP CONSTRAINT "Player_sessionId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Player" ADD CONSTRAINT "Player_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
