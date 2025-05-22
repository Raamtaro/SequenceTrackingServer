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
                description: true

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
    // const client = req.user; 
    const { name, description } = req.body as PoseData;
    

    if (!name) {
        res.status(400).json(
            {
                error: "Please provide a name to create a pose."
            }
        )
        return;
    }

    /**
     * Delete commented block after next git commit 
     */

    // const dupe = await prisma.pose.findUnique( //I don't need to add this check because Prisma will already throw an error if I break the unique constraint rule set on the "name" field in the Pose Schema
    //     {
    //         where: {
    //             name
    //         }
    //     }
    // )

    // if (dupe) {
    //     res.status(400).json(
    //         {
    //             error: `A pose with name ${name} already exists.`
    //         }
    //     )
    //     return;
    // }


    // const poseData: PoseData = {name};
    // if (description) poseData.description = description //Description is optional, so only add it if it is included

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
    
}

const deletePose = async (req: Request, res: Response): Promise<void> => {

}

export default {
    getPose, 
    getPoses,
    createPose,
    updatePose,
    deletePose
}