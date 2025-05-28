import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

interface CreateEntryBody {
    poseId: string
    rating: number
    notes?: string
}

interface UpdateEntryBody {
    rating?: number
    notes?: string
}

const prisma = new PrismaClient()


export const listEntries = async (
    req: Request<{ logId: string }>,
    res: Response
): Promise<void> => {
    const { logId } = req.params
    const entries = await prisma.practiceLogEntry.findMany({
        where: { logId },
        include: { pose: { select: { name: true } } }
    })
    res.json({ entries })
}

export const getEntry = async (
    req: Request<{logId: string; entryId: string}>,
    res: Response
): Promise<void> => {
    const { entryId } = req.params
    const entry = await prisma.practiceLogEntry.findUnique({
        where: { id: entryId },
        include: { pose: { select: { name: true } } }
    })
    if (!entry) {
        res.status(404).json({ error: 'Entry not found' })
        return
    }
    res.json({ entry })
}



export const createEntry = async (
    req: Request<{ logId: string }, {}, CreateEntryBody>,
    res: Response
): Promise<void> => {
    const { logId } = req.params
    const { poseId, rating, notes } = req.body

    const entry = await prisma.practiceLogEntry.create({
        data: { logId, poseId, rating, notes }
    })
    res.status(201).json({ entry })
}



export const updateEntry = async (
    req: Request<{ logId: string; entryId: string }, {}, UpdateEntryBody>,
    res: Response
): Promise<void> => {
    const { entryId } = req.params
    const data: any = {}
    if (req.body.rating !== undefined) data.rating = req.body.rating
    if (req.body.notes !== undefined) data.notes = req.body.notes

    const updated = await prisma.practiceLogEntry.update({
        where: { id: entryId },
        data
    })
    res.json({ entry: updated })
}


export const deleteEntry = async (
    req: Request<{ logId: string; entryId: string }>,
    res: Response
): Promise<void> => {
    const { entryId } = req.params
    await prisma.practiceLogEntry.delete({ where: { id: entryId } })
    res.sendStatus(204)
}