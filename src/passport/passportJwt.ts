import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

dotenv.config()