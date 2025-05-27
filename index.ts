import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import { localStrategy } from "./src/passport/passportLocal";
import { jwtStrategy } from "./src/passport/passportJwt";
import session from 'express-session'
import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";


import router from './src/routes/'
import { PrismaSessionStore } from "@quixo3/prisma-session-store";


dotenv.config();

const app: Express = express();
const port: number = 3000;

//Session Setup

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
    session(
        {
            store: new PrismaSessionStore(
                new PrismaClient(),
                {
                    checkPeriod: 2 * 60 * 1000,  //ms
                    dbRecordIdIsSessionId: true,
                    dbRecordIdFunction: undefined,
                }
            ),
            secret: process.env.SESSION_SECRET as string,
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 1000 * 60 * 60 * 24 }
        }
    )
)

passport.use(localStrategy)
passport.use(jwtStrategy)
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', router.auth)
app.use('/pose', router.pose)
app.use('/sequence', router.sequence)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Something Broke!")
})

app.listen(port, (): void => {
    console.log(`listening on port: ${port}`)
})