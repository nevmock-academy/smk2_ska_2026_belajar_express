import jwt from "jsonwebtoken";
import BaseError from "../base_classes/base_error.js";

export default function resetTokenMiddleware(purpose) {
    return (req, res, next) => {
        const authorization = req.headers.authorization;

        if (!authorization?.startsWith("Bearer ")) {
            return next(BaseError.unauthorized("Token tidak ditemukan"));
        }

        const token = authorization.slice("Bearer ".length);

        try {
            const payload = jwt.verify(token, process.env.JWT_RESET_SECRET);

            if (payload.purpose !== purpose) {
                throw new Error("wrong purpose");
            }

            req.tokenPayload = payload;
            next();
        } catch {
            next(BaseError.unauthorized("Token tidak valid atau sudah kedaluwarsa"));
        }
    };
}