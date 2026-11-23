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
            lastOtp && Date.now() - lastOtp.createdAt.getTime() < OTP_RESEND_COOLDOWN_MS
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
            logger.error(`Gagal kirim email reset password: ${error.message}`);
        }

        return { message:  "Jika email terdaftar, kode OTP telah dikirim." };
    }

    // Reset Password
    async resetpassword(data) {
        const { email, otp_verification, password, password_confirmation } = data;
        
        const INVALID_OTP = "OTP tidak valid atau sudah kedaluwarsa";

        if (password !== password_confirmation) {
            throw BaseError.invalidParams("Konfirmasi password tidak cocok");
        }

        // Ambil OTP terbaru yang masih aktif 
        const record = await prisma.otpCode.findFirst({
            where: {
                email, 
                purpose: RESET_PURPOSE,
                usedAt: null,
                expiresAt: {gt: new Date() },
                attempts: { lt: OTP_MAX_ATTEMPTS },
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
        return { message: "Password berhasil direset." };
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
