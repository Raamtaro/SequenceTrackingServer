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

const getSequence = async (req: Request, res: Response): Promise<void> => {

}

const getSequences = async (req: Request, res: Response): Promise<void> => {

}

// /**
//  * This is okay, but we should probably use the Request Generic to define the body type.
//  */

// const createSequence = async (req: Request, res: Response): Promise<void> => {


//     const { name, description } = req.body as {
//         name: string
//         description?: string
//     }

//     if (!name) {
//         res.status(400).json(
//             {
//                 error: "Please provide a name to create a sequence."
//             }
//         )
//         return;
//     }

//     const newSequence = await prisma.sequence.create(
//         {
//             data: {
//                 name,
//                 ...(description && { description })
//             }
//         }
//     )

//     res.status(201).json(
//         {
//             newSequence
//         }
//     )
// }


/**
 * This is the better way to define the body type using a Request Generic.
 * Delete this after the next commit.
 */

const createSequence = async (req: Request<{}, {}, CreateSequenceBody>, res: Response): Promise<void> => {
    const {name, description} = req.body;
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
            newSequence
        }
    )
}

const updateSequence = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    const { description } = req.body

    const updatedSequence = await prisma.sequence.update(
        {
            where: {
                id
            },
            data: {
                description
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

const deleteSequence = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id

    await prisma.sequence.delete(
        {
            where: {
                id
            }
        }
    )
    res.status(200).json(
        {
            message: `Deleted sequence ${id}`
        }
    )
}
export default {
    getSequence,
    getSequences,
    createSequence,
    updateSequence,
    deleteSequence
}