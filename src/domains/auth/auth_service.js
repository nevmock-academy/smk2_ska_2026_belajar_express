import joi from "joi";
import BaseError from "../../base_classes/base_error.js";
import StatusCodes from "../../constants/status_codes.js";

class AuthService {
    async register(data) {

        // CHECK APAKAH EMAIL YANG DI-INPUTKAN SUDAH TERDAFTAR ATAU BELUM DI DATABASE

        //  KALAU SUDAH ADA (EXIST) MAKA
            // cara 1
            // throw BaseError.invalidParams("Email already registered. Please use a different email address.")

        // KALAU TIDAK EXIST

        // TAMBAHKAN / INSERT KE DATABASE

        // KALAU GAGAL INSERT KE DATABASE MAKA THROW ERROR
        //     throw BaseError.internalServer("Failed to register user. Please try again later.");

        // SUKSES
        // return {
        //     message: "Registration successful",
        // };

        // cara 2
        // throw new BaseError({
        //     code: StatusCodes.BAD_REQUEST.code,
        //     codeName: StatusCodes.BAD_REQUEST.codeName,
        //     message: StatusCodes.BAD_REQUEST.message,
        //     errorName: "Bad Request",
        // })
    }
}

export default new AuthService();
