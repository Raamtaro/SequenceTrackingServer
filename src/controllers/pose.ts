import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';


dotenv.config();

const prisma = new PrismaClient();

interface PoseData {
    name: string
    description?: string
}

const getPose = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;


    if (!name) {
        res.status(400).json(
            {
                error: "Please provide the name of a pose in the request body."
            }
        )
    }

    const pose = await prisma.pose.findUnique(
        {
            where: {
                name
            },
            select: {
                id: true,
                name: true,
                description: true,
            }
        }
    )

    res.status(200).json(
        {
            pose
        }
    )
}

const getPoses= async (req: Request, res: Response): Promise<void> => {
    const allPoses = await prisma.pose.findMany(
        {
            select: {
                name: true,
                id: true,
            }
        }
    )

    res.status(200).json(
        {
            allPoses
        }
    )
}

const createPose = async (req: Request, res: Response): Promise<void> => {
    // const client = req.user; //Leaving commented for now as I might utilize this when I start allowing users to add poses to the DB if it doesn't exist yet
    const { name, description } = req.body as PoseData;

    if (!name) {
        res.status(400).json(
            {
                error: "Please provide a name to create a pose."
            }
        )
        return;
    }

    const newPose = await prisma.pose.create(
        {
            data: {
                name,
                ...(description && {description})

            }
        }
    )

    res.status(201).json(
        {
            newPose
        }
    )
}

const updatePose = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    const { description } = req.body

    const updatedPose = await prisma.pose.update(
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
            message: `Updated pose ${id}:`,
            updatedPose
        }
    )


}

const deletePose = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id

    await prisma.pose.delete(
        {
            where: {
                id
            }
        }
    )
    res.status(200).json(
        {
            message: `Deleted pose ${id}`
        }
    )
}

export default {
    getPose, 
    getPoses,
    createPose,
    updatePose,
    deletePose
}