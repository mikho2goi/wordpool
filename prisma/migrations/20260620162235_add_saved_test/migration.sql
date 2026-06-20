-- CreateTable
CREATE TABLE "SavedTest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "deckId" INTEGER NOT NULL,
    "cardIds" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedTest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedTest" ADD CONSTRAINT "SavedTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
