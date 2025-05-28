import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

// Extend Express Request type to include user with id
declare global {
    namespace Express {
        interface User {
            id: string;
            // add other properties if needed
        }
        interface Request {
            user?: User;
        }
    }
}

interface CreateLogBody {
    sequenceId: string
    date?: string    // ISO string
    overallRating?: number
    overallNotes?: string
}

interface UpdateLogBody {
    date?: string
    overallRating?: number
    overallNotes?: string
}

const prisma = new PrismaClient()

// GET /logs
export const listLogs = async (
    req: Request,
    res: Response
): Promise<void> => {
    const userId = req.user!.id // assume JWT middleware populated req.user
    const logs = await prisma.practiceLog.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        include: { sequence: { select: { name: true } } }
    })
    res.json({ logs })
}

// POST /logs
export const createLog = async (
    req: Request<{}, {}, CreateLogBody>,
    res: Response
): Promise<void> => {
    const userId = req.user!.id;
    const { sequenceId, date, overallRating, overallNotes } = req.body;

    // Run everything in one transaction so you don't end up half-seeded.
    const { log, entries } = await prisma.$transaction(async (tx) => {
        // 1) Create the log
        const log = await tx.practiceLog.create({
            data: {
                userId,
                sequenceId,
                date: date ? new Date(date) : undefined,
                overallRating,
                overallNotes,
            },
        });

        // 2) Grab the sequence’s poses (and their `order`)
        const seq = await tx.sequence.findUniqueOrThrow({
            where: { id: sequenceId },
            select: {
                poses: {
                    select: { poseId: true, order: true },
                    orderBy: { order: "asc" },
                },
            },
        });

        // 3) Seed one entry per pose, with a default rating (e.g. 0)
        const data = seq.poses.map(({ poseId, order }) => ({
            logId: log.id,
            poseId,
            rating: 0,       // placeholder so your UI can PATCH later
            notes: "",
            // if you want to preserve display order:
            order,
        }));
        await tx.practiceLogEntry.createMany({ data }); //Might fail here because order doesn't exist on PracticeLogEntry

        // 4) Re-fetch the entries with pose names and ordering
        const entries = await tx.practiceLogEntry.findMany({
            where: { logId: log.id },
            include: { pose: { select: { name: true } } },
            orderBy: { order: "asc" }, // There is a compile-time error here because order doesn't exist on PracticeLogEntry    
        });

        return { log, entries };
    });

    // 5) Return both in one shot
    res.status(201).json({ log, entries });
};

// GET /logs/:logId
export const getLog = async (
    req: Request<{ logId: string }>,
    res: Response
): Promise<void> => {
    const { logId } = req.params
    const log = await prisma.practiceLog.findUnique({
        where: { id: logId },
        include: {
            sequence: { select: { name: true } },
            entries: {
                orderBy: { id: 'asc' },  // or by pose order if you prefer
                include: { pose: { select: { name: true } } }
            }
        }
    })
    if (!log) {
        res.status(404).json({ error: 'Log not found' })
        return
    }
    res.json({ log })
}

// PATCH /logs/:logId

export const updateLog = async (
    req: Request<{ logId: string }, {}, UpdateLogBody>,
    res: Response
): Promise<void> => {
    const { logId } = req.params
    const data: any = {}
    if (req.body.date) data.date = new Date(req.body.date)
    if (req.body.overallRating !== undefined) data.overallRating = req.body.overallRating
    if (req.body.overallNotes !== undefined) data.overallNotes = req.body.overallNotes

    const updated = await prisma.practiceLog.update({
        where: { id: logId },
        data
    })
    res.json({ log: updated })
}

// DELETE /logs/:logId
export const deleteLog = async (
    req: Request<{ logId: string }>,
    res: Response
): Promise<void> => {
    const { logId } = req.params
    // cascade delete entries first (if you haven't set up ON DELETE CASCADE)
    await prisma.practiceLogEntry.deleteMany({ where: { logId } })
    await prisma.practiceLog.delete({ where: { id: logId } })
    res.sendStatus(204)
}