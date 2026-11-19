import BaseError from "../../base_classes/base_error.js";
import bcrypt from "bcrypt";
import prisma from "../../libs/prisma.js";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

class AuthService {
    async register(data) {
        const { name, email, password } = data;

        // CHECK EMAIL
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            throw BaseError.invalidParams("Email sudah terdaftar");
        }

        try {
            // HASH PASSWORD
            const hashedPassword = await bcrypt.hash(password, 10);

            // INSERT USER
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword
                }
            });

            return {
                id: user.id,
                name: user.name,
                email: user.email
            };

        } catch (error) {

            // HANDLE DUPLICATE EMAIL
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                throw BaseError.invalidParams("Email sudah terdaftar");
            }

            throw error;
        }
    }

    async login(data) {
        const { email, password } = data;
        const DUMMY_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8.6U5G6u2k8l4/e3.P1y8u9r0/z9a.';


        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            throw BaseError.unauthorized("Email atau password salah");
        }

        const passwordHash = user ? user.password : DUMMY_HASH;
        const isPasswordValid = await bcrypt.compare(password, passwordHash);

        if (!isPasswordValid) {
            throw BaseError.unauthorized("Email atau password salah");
        }
        
        const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token
        }
        
        
    }

    async profile(data) {
        const userId = Number(data.userId);

        if (!Number.isInteger(userId) || userId <= 0) {
            throw BaseError.unauthorized("Token tidak valid");
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                isVerified: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw BaseError.unauthorized("User tidak ditemukan");
        }

        return user;
    }
}

export default new AuthService();
