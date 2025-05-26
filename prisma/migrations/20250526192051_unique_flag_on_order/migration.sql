/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `SequenceToPose` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SequenceToPose_order_key" ON "SequenceToPose"("order");
