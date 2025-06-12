import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// your test user id
const TEST_USER_ID = 'cmar963xd0000ov1lvwmmj5cc'

// the exact names you used when seeding sequences
const PRIMARY_NAME = 'Ashtanga Primary Series'
const INTERMEDIATE_NAME = 'Ashtanga Intermediate Series'

// helper: random integer in [min, max]
function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {


    await prisma.practiceLogEntry.deleteMany({
    where: { log: { userId: TEST_USER_ID } },
    })
    await prisma.practiceLog.deleteMany({
    where: { userId: TEST_USER_ID },
    })

    // 1) fetch the two sequences and their pose orders
    const sequences = await prisma.sequence.findMany({
        where: { name: { in: [PRIMARY_NAME, INTERMEDIATE_NAME] } },
        select: {
            id: true,
            name: true,
            poses: {
                select: { poseId: true, order: true },
                orderBy: { order: 'asc' },
            },
        },
    })

    if (sequences.length !== 2) {
        console.error(
            'Could not find both sequences. Make sure you seeded them first.'
        )
        process.exit(1)
    }

    // map name → { id, poses }
    const seqMap = Object.fromEntries(
        sequences.map((s) => [s.name, { id: s.id, poses: s.poses }])
    ) as Record<
        typeof PRIMARY_NAME | typeof INTERMEDIATE_NAME,
        { id: string; poses: { poseId: string; order: number | null }[] }
    >

    // 2) for each of the last 7 days...
    for (let daysAgo = 1; daysAgo <= 7; daysAgo++) {
        const date = new Date()
        date.setDate(date.getDate() - daysAgo)

        for (const seqName of [PRIMARY_NAME, INTERMEDIATE_NAME] as const) {
            const { id: sequenceId, poses } = seqMap[seqName]
            const overallRating = randInt(1, 10)

            // 3) transaction: create log + its entries
            await prisma.$transaction(async (tx) => {
                // a) create the log
                const log = await tx.practiceLog.create({
                    data: {
                        userId: TEST_USER_ID,
                        sequenceId,
                        date,
                        overallRating,
                        overallNotes: '',
                    },
                })

                // b) bulk‐create one entry per pose
                const entryData = poses.map(({ poseId }) => ({
                    logId: log.id,
                    poseId,
                    rating: randInt(1, 10),
                    notes: '',
                }))

                await tx.practiceLogEntry.createMany({ data: entryData })
            })

            console.log(
                `✅ ${seqName} logged on ${date.toISOString().slice(0, 10)}`
            )
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
        console.log('🎉 Seeding of practice logs complete.')
    })
