import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import prisma from "../../libs/prisma.js";
import BaseError from "../../base_classes/base_error.js";

const userSelect = {
    id: true,
    name: true,
    email: true,
    isVerified: true,
    createdAt: true,
    updatedAt: true,
};

const parseUserId = (id) => {
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
        throw BaseError.badRequest("ID pengguna tidak valid");
    }

    return userId;
};

const handlePrismaError = (error) => {
    if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    ) {
        throw BaseError.duplicate("Email sudah digunakan");
    }

    if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
    ) {
        throw BaseError.notFound("Pengguna tidak ditemukan");
    }

    throw error;
};

class UserService {
    async getAll() {
        return prisma.user.findMany({
            select: userSelect,
            orderBy: { createdAt: "desc" },
        });
    }

    async getById(id) {
        const userId = parseUserId(id);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: userSelect,
        });

        if (!user) {
            throw BaseError.notFound("Pengguna tidak ditemukan");
        }

        return user;
    }

    async create(data) {
        const password = await bcrypt.hash(data.password, 10);

        try {
            return await prisma.user.create({
                data: {
                    name: data.name.trim(),
                    email: data.email.trim().toLowerCase(),
                    password,
                },
                select: userSelect,
            });
        } catch (error) {
            handlePrismaError(error);
        }
    }

    async update(id, data) {
        const userId = parseUserId(id);
        const updateData = {};

        if (data.name !== undefined) {
            updateData.name = data.name.trim();
        }

        if (data.email !== undefined) {
            updateData.email = data.email.trim().toLowerCase();
        }

        if (data.password !== undefined) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        try {
            return await prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: userSelect,
            });
        } catch (error) {
            handlePrismaError(error);
        }
    }

    async remove(id) {
        const userId = parseUserId(id);

        try {
            await prisma.user.delete({
                where: { id: userId },
            });
        } catch (error) {
            handlePrismaError(error);
        }
    }
}

export default new UserService();