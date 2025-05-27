/**
 * Seed the database with initial Data.
 * 
 * 1. Create two sequences - Ashtanga Primary and Ashtanga Intermediate
 * 2. Create poses for each sequence (refer to note).
 * 3. Populate each sequence with the respective poses.
 * * NOTE: Both series include some of the same poses, so they should only be created once.
 */


import { PrismaClient } from "@prisma/client";
import { primarySeries, intermediateSeries } from "./seedData";


const prisma = new PrismaClient();
const allPoses = Array.from(new Set([...primarySeries.poses, ...intermediateSeries.poses]));
const poseMap: Record<string, { id: string; name: string }> = {};

const seedDatabase = async (): Promise<void> => {
    /**
     * 1. Clear the database of existing data.
     * 2. Create the poses which will populate both sequences.
     * 3. Create both of the sequences.
     * 4. Query sequenceToPose to populate the sequences with the poses.
     */
    await clearDatabase();
    await createPoses();
    await createSequences();

}

// Helpers

const clearDatabase = async (): Promise<void> => {
    console.log("Clearing database...");


    await prisma.sequenceToPose.deleteMany({});
    await prisma.sequence.deleteMany({});
    await prisma.pose.deleteMany({});
    console.log("Database cleared.");
}

const createPoses = async (): Promise<void> => {
    console.log("Creating poses...");

    for (const name of allPoses) {
        const pose = await prisma.pose.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        poseMap[name] = pose;
    }

    console.log("Poses created:", Object.keys(poseMap).length);
    console.log("Pose map:", poseMap);
}

const createSequences = async (): Promise<void> => {
    console.log("Initialising sequences...");
    for (const series of [primarySeries, intermediateSeries]) {
        const sequence = await prisma.sequence.upsert(
            {
                where: { name: series.name },
                update: {},
                create: {
                    name: series.name,
                    ...(series.description && { description: series.description }),
                }
            }
        )

        for (let i = 0; i < series.poses.length; i++) {
            const poseName = series.poses[i];
            const pose = poseMap[poseName];

            await prisma.sequenceToPose.upsert(
                {
                    where: {
                        sequenceId_poseId: {
                            sequenceId: sequence.id,
                            poseId: pose.id,

                        }
                    },
                    update: {
                        order: i + 1
                    },
                    create: {
                        sequenceId: sequence.id,
                        poseId: pose.id,
                        order: i + 1,
                    }
                }
            )
        }

        console.log(`Sequence "${series.name}" created with ${series.poses.length} poses.`);

    }
}






// Main execution
seedDatabase()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("Prisma Disconnected, seeding complete.")
    });