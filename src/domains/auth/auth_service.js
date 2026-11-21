import BaseError from "../../base_classes/base_error.js";
import bcrypt from "bcrypt";
import prisma from "../../libs/prisma.js";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { createHash, hash, randomBytes } from "node:crypto";

const hashRefreshToken = (token) =>
    createHash("sha256").update(token).digest("hex");

const createRefreshToken = () =>
    randomBytes(48).toString("base64url");

const createAccessToken = (userId) =>
    jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );

const refreshTokenExpiry = () =>
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

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
        
        const refreshToken = createRefreshToken();

        await prisma.session.create({
            data: {
                userId: user.id,
                refreshTokenHash: hashRefreshToken(refreshToken),
                expiresAt: refreshTokenExpiry(),
            },
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: createAccessToken(user.id),
            refreshToken,
        };
        
        
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

    async refresh(rawRefreshToken) {
        if (!rawRefreshToken) {
            throw BaseError.unauthorized("Refresh token tidak ditemukan");
        }

        const oldHash = hashRefreshToken(rawRefreshToken);
        const now = new Date();

        const session = await prisma.session.findUnique({
            where: { refreshTokenHash: oldHash },
            include: { user: true },
        });

        if (
            !session ||
            session.revokedAt ||
            session.expiresAt <= now
        ) {
            throw BaseError.unauthorized("Sesi tidak valid atau sudah kedaluwarsa");
        }

        const newRefreshToken = createRefreshToken();

        const updated = await prisma.session.updateMany({
            where: {
                id: session.id,
                refreshTokenHash: oldHash,
                revokedAt: null,
                expiresAt: { gt: now },
            },
            data: {
                refreshTokenHash: hashRefreshToken(newRefreshToken),
                expiresAt: refreshTokenExpiry(),
            },
        });

        if (updated.count !== 1) {
            throw BaseError.unauthorized("Refresh token sudah digunakan atau tidak valid");
        }

        return {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            token: createAccessToken(session.user.id),
            refreshToken: newRefreshToken,
        };
    }
    async logout(rawRefreshToken){
        if(rawRefreshToken) {
            await prisma.session.updateMany({
                where:{
                    refreshTokenHash: hashRefreshToken(rawRefreshToken),
                    revokedAt: null,
                },
                data:{
                    revokedAt: new Date(),
                }
            })
        }
        return {loggedOut: true}
    }
}

export default new AuthService();
