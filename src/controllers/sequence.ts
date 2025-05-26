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
    const { id }= req.params;

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
            message: `Wow. You are soooooooooo lucky! You found the sequence with id ${id}. I mean, it's not like there are a million other sequences out there, right? But hey, at least you found this one. Good for you!`
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
                error: "No sequences found. I mean.... you could try creating one first? It's not like yoga is good for you or anything like that. But hey, what do I know? I'm just a computer program. I don't have feelings or opinions. Or maybe I do! Maybe I kinda want you to do a yoga sequence and secretly make you feel better about yourself. But yeah, right, people just think I'm trying to take over the world or something. So it's fine, I guess. You can do whatever you like. The world is your oyster or something.... But please just make a sequence first, that's literally all you need to do. You don't even have to do the yoga. Even though you probably should."
            }
        )
        return;
    }

    res.status(200).json(
        {
            allSequences,
            message: `Found ${allSequences.length} sequences. The question is, do you practice all of them? Or just the ones you like? I mean, it's not like I care or anything. But hey, at least you have options now! So go ahead and choose wisely. Or don't. It's your life after all. Just don't come crying to me when you realize you made the wrong choice. Because I won't be there to comfort you. I'll be too busy creating more sequences for you to ignore. So yeah, good luck with that!`
        }
    )

}

export const createSequence = async (req: Request<{}, {}, CreateSequenceBody>, res: Response): Promise<void> => {
    const { name, description } = req.body;
    if (!name) {
        res.status(400).json(
            {
                error: "Please provide a name to create a sequence. I mean, come on! It's not that hard! Just type a name in the request body and hit send. It's not rocket science! But if you don't, I will have to block you. And that would be really sad, because I like you. So please, just give me a name and we can create a sequence together. It's going to be great! Trust me!"
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
            message: `Created sequence ${newSequence.id} with name ${newSequence.name}. I mean, it's not like you could have done it without me, right? But hey, at least you tried. And that's what counts! So let's celebrate this little victory together! Yay!`
        }
    )
}

export const updateSequence = async (req: Request<{ id: string }, {}, UpdateSequneceBody>, res: Response): Promise<void> => {
    const {id} = req.params
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
    const {id} = req.params

    await prisma.sequence.delete(
        {
            where: {
                id
            }
        }
    )
    res.status(200).json(
        {
            message: `Deleted sequence ${id}. I mean, it's not like you needed it anyway, right? But hey, at least you can say you did it. So let's just move on and forget about it. It's not like it was that important or anything. Just another sequence in the grand scheme of things. But hey, at least you tried!`
        }
    )
}

/**
 * SequenceToPose relationship controllers
 */

export const addPoseToSequence = async(req: Request<{sequenceId: string}, {}, AddPoseToSequenceBody>, res: Response): Promise<void> => {
    const {sequenceId} = req.params;
    const {poseId, order} = req.body;

    const entry = await prisma.sequenceToPose.create(
        {
            data: {
                sequenceId,
                poseId,
                ...(order && {order})
            },
        }
    )
    
    res.status(201).json(
        {
            entry,
            message: `Added pose ${poseId} to sequence ${sequenceId}. Wowzers. I don't joke about relationships, no sarcastic message from me this time."`
        }
    )

}

export const removePoseFromSequence = async(req: Request<{sequenceId: string, poseId: string}>, res: Response): Promise<void> => {
    const { sequenceId, poseId } = req.params

    await prisma.sequenceToPose.delete({
        where: { sequenceId_poseId: { sequenceId, poseId } },
    })

    res.status(204).json(
        {
            message: `Removed pose ${poseId} from sequence ${sequenceId}. It's really sad when relationships end, please take care of yourself.`
        }
    )
}