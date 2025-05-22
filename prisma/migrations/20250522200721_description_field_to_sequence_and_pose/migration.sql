-- AlterTable
ALTER TABLE "Pose" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Sequence" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "SequenceToPose" ALTER COLUMN "order" DROP NOT NULL;
