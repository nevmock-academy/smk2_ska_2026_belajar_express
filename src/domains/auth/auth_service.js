import BaseError from "../../base_classes/base_error.js";
import bcrypt from "bcrypt";
import prisma from "../../libs/prisma.js";
import mailer from "../../libs/mailer.js";
import logger from "../../utils/logger.js";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { generateOtp, hashOtp, verifyOtp } from "../../utils/otp.js"

// Konfigurasi Forgot Password
const RESET_PURPOSE = "reset_password";
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS =  60 * 1000;
const OTP_MAX_ATTEMPTS = 3;

class AuthService {
    // RegisteR
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

    // Login
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

    // Profile
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

    // Forgot Password
    async forgotpassword(data) {
        const { email } = data;

        const user = await prisma.user.findUnique({ where: { email }});

        if (!user) {
            return {message: "Jika email terdaftar, kode OTP telah dikirim."};
        }

        // Cegah spam email
        const lastOtp = await prisma.otpCode.findFirst({
            where: { email, purpose: RESET_PURPOSE },
            orderBy: { createdAt: "desc" },
        });

        if (
            lastOtp && Date.now - lastOtp.createdAt.getTime() < OTP_RESEND_COOLDOWN_MS
        ) {
            return { message: "Jika email terdaftar, kode OTP telah dikirim. Kode baru dapat diminta setelah 60 detik."};
        }

        const otp = generateOtp();
        const codeHash = await hashOtp(otp);

        // Menghanguskan OTP lama yang belum diapakai, lalu buat baru
        await prisma.$transaction([
            prisma.otpCode.updateMany({
                where: {email, purpose: RESET_PURPOSE, usedAt: null },
                data: { usedAt: new Date() }, 
            }),
            prisma.otpCode.create({
                data: {
                    email,
                    codeHash,
                    purpose: RESET_PURPOSE,
                    expiresAt: new Date(Date.now() + OTP_TTL_MS),
                },
            }),
        ]);

        try {
            await mailer.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: "Kode OTP Reset Password",
                text:
                    `Halo ${user.name},\n\n` +
                    `Kode OTP untuk reset password kamu: ${otp}\n` +
                    `Kode berlaku ${OTP_TTL_MS / 60000} menit. ` +
                    `Jangan bagikan kode ini ke siapa pun.\n\n` +
                    `Jika kamu tidak merasa meminta reset password, abaikan email ini.`,
                html: 
                    `<p>Halo ${user.name},</p>` +
                    `<p>Kode OTP untuk reset password kamu:</p>` +
                    `<h2 style="letter-spacing:4px">${otp}</h2>` +
                    `<p>Kode berlaku ${OTP_TTL_MS / 60000} menit. ` +
                    `Jangan bagikan kode ini ke siapa pun.</p>` +
                    `<p>Jika kamu tidak merasa meminta reset password, abaikan email ini.</p>`
            });
        } catch (error) {
            logger.error('Gagal kirim email reset password: ${error.message}')
        }

        return { message:  "Jika email terdaftar, kode OTP telah dikirim." };
    }

    // Reset Password
    async resetpassword(data) {
        const { email, otp_verification, password } = data;
        const INVALID_OTP = "OTP tidak valid atau sudah kedaluwarsa";

        // Ambil OTP terbaru yang masih aktif 
        const record = await prisma.otpCode.findFirst({
            where: {
                email, 
                purpose: RESET_PURPOSE,
                usedAt: null,
                expiresAt: {gt: new Date() },
                attemps: { lt: OTP_MAX_ATTEMPTS },
            },
            orderBy: { createdAt: "desc" },
        });

        if (!record) {
            throw BaseError.badRequest(INVALID_OTP);
        }

        const isOtpValid = await verifyOtp(otp_verification, record.codeHash);

        if (!isOtpValid) {
            // Mencatat percobaan gagal
            await prisma.otpCode.update({
                where: { id: record.id },
                data: { attempts: {increment: 1} },
            });
            throw BaseError.badRequest(INVALID_OTP);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.$transaction(async (tx) => {
            // Menandai OTP terpakai, kalau sudah terpakai request lain -> gagal
            const claimed = await tx.otpCode.updateMany({
                where: { id: record.id, usedAt: null },
                data: { usedAt: new Date() },
            });

            if (claimed.count === 0) {
                throw BaseError.badRequest(INVALID_OTP);
            }

            await tx.user.update({
                where: { email },
                data: { password: hashedPassword },
            });
        });
    }
}

export default new AuthService();
