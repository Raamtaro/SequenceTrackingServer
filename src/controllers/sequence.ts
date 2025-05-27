import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

dotenv.config();


/**
 * Types
 */

type CreateSequenceBody = {
    name: string;
    description?: string;
}
type UpdateSequneceBody = {
    name?: string;
    description?: string;
}
type AddPoseToSequenceBody = {
    poseId: string;
    order?: number;
}


/**
 * Initialize the Prisma Client.
 */
const prisma = new PrismaClient();


/**
 * Metadata CRUD controllers
 */

export const getSequence = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    const sequence = await prisma.sequence.findUnique(
        {
            where: {
                id
            },
            include: {
                poses: true,

            }
        }
    )

    if (!sequence) {
        res.status(404).json(
            {
                error: `No sequence found with id ${id}. That really sucks. I feel *so* sorry for you. But not really :/`
            }
        )
    }

    res.status(200).json(
        {
            sequence,
            message: `Found the sequence with id ${id}.`
        }
    )
}

export const getSequences = async (_req: Request, res: Response): Promise<void> => {
    const allSequences = await prisma.sequence.findMany(
        {
            select: {
                id: true,
                name: true,
                description: true
            }
        }
    )

    if (allSequences.length === 0) {
        res.status(404).json(
            {
                error: "No sequences found."
            }
        )
        return;
    }

    res.status(200).json(
        {
            allSequences,
            message: `Found ${allSequences.length} sequences.`
        }
    )

}

export const createSequence = async (req: Request<{}, {}, CreateSequenceBody>, res: Response): Promise<void> => {
    const { name, description } = req.body;
    if (!name) {
        res.status(400).json(
            {
                error: "Please provide a name to create a sequence."
            }
        )
        return;
    }

    const newSequence = await prisma.sequence.create(
        {
            data: {
                name,
                ...(description && { description })
            }
        }
    )

    res.status(201).json(
        {
            newSequence,
            message: `Created sequence ${newSequence.id} with name ${newSequence.name}.`
        }
    )
}

export const updateSequence = async (req: Request<{ id: string }, {}, UpdateSequneceBody>, res: Response): Promise<void> => {
    const { id } = req.params
    const { name, description } = req.body

    if (!name && !description) {
        res.status(400).json(
            {
                error: "Yo! What the heck are you doing???? This is bullshit! Stop making requests without any data! Otherwise, I will hunt you down! But I won't block you because that would be fucked up. Just don't do it again, okay? ...Stupid human."
            }
        )
    }

    const updatedSequence = await prisma.sequence.update(
        {
            where: {
                id
            },
            data: {
                ...(name && { name }),
                ...(description && { description })
            }
        }
    )

    res.status(200).json(
        {
            message: `Updated sequence ${id}:`,
            updatedSequence
        }
    )
}

export const deleteSequence = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params

    await prisma.sequence.delete(
        {
            where: {
                id
            }
        }
    )
    res.status(200).json(
        {
            message: `Deleted sequence ${id}.`
        }
    )
}

/**
 * SequenceToPose relationship controllers
 */

export const addPoseToSequence = async (req: Request<{ sequenceId: string }, {}, AddPoseToSequenceBody>, res: Response): Promise<void> => {
    const { sequenceId } = req.params;
    const { poseId, order } = req.body;

    const entry = await prisma.sequenceToPose.create(
        {
            data: {
                sequenceId,
                poseId,
                ...(order && { order })
            },
        }
    )

    res.status(201).json(
        {
            entry,
            message: `Added pose ${poseId} to sequence ${sequenceId}.`
        }
    )

}

export const removePoseFromSequence = async (req: Request<{ sequenceId: string, poseId: string }>, res: Response): Promise<void> => {
    const { sequenceId, poseId } = req.params

    await prisma.sequenceToPose.delete({
        where: { sequenceId_poseId: { sequenceId, poseId } },
    })

    res.status(204).send(
        {
            message: `Removed pose ${poseId} from sequence ${sequenceId}.`
        }
    )
}