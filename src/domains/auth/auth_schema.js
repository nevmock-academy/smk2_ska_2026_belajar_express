import Joi from "joi";

const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required.",
        "string.email": "Email must be a valid email address.",
    }),
    // otp_verification: Joi.string().required().min(5).messages({
    //     "string.empty": "OTP verification is required.",
    // }),
    password: Joi.string()
        .required()
        .min(8)
        .pattern(/^(?=.*[A-Z]).{8,}$/)
        .messages({
            "string.empty": "Passw2ord is required.",
            "string.min": "Password must be at least 8 characters long.",
            "string.pattern.base":
                "Password must be at least 8 characters long and contain at least 1 uppercase letter.",
        }),
    password_confirmation: Joi.string()
        .required()
        .valid(Joi.ref("password"))
        .messages({
            "string.empty": "Password confirmation is required.",
            "any.only": "Password confirmation does not match password.",
        }),
    name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 2 characters long.",
    "string.max": "Name must not exceed 100 characters.",
    "any.required": "Name is required.",
}),
}).required().messages({
    "any.required": "Request body is required.",
});
// ====== Reusable fields ======
const email = Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
});

const otp = Joi.string()
    .length(6)
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
        "string.empty": "OTP verification is required.",
        "string.length": "OTP must contain 6 digits.",
        "string.pattern.base": "OTP must contain 6 digits.",
        "any.required": "OTP verification is required.",
    });

const password = Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[A-Z]).{8,}$/)
    .messages({
        "string.empty": "Password is required.",
        "string.min": "Password must be at least 8 characters long.",
        "string.pattern.base":
            "Password must be at least 8 characters long and contain at least 1 uppercase letter.",
        "any.required": "Password is required.",
    });

const passwordConfirmation = Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({
        "string.empty": "Password confirmation is required.",
        "any.only": "Password confirmation does not match password.",
        "any.required": "Password confirmation is required.",
    });

const loginSchema = Joi.object({
    email,
    // login tidak perlu cek pattern, cukup required
    password: Joi.string().required().messages({
        "string.empty": "Password is required.",
        "any.required": "Password is required.",
    }),
});

const logoutSchema = Joi.object({
    // sesuaikan: kalau pakai refresh token di body
    refresh_token: Joi.string().required().messages({
        "string.empty": "Refresh token is required.",
        "any.required": "Refresh token is required.",
    }),
});

const forgotpasswordSchema = Joi.object({
    email,
});

const resetpasswordSchema = Joi.object({
    email,
    otp_verification: otp,
    password,
    password_confirmation: passwordConfirmation,
});

const verifyemailSchema = Joi.object({
    email,
    otp_verification: otp,
});

const resendverificationSchema = Joi.object({
    email,
});

const updateprofileSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).messages({
        "string.empty": "Name cannot be empty.",
        "string.min": "Name must be at least 2 characters long.",
        "string.max": "Name must not exceed 100 characters.",
    }),
    phone: Joi.string()
        .pattern(/^(\+62|62|0)8[1-9][0-9]{6,10}$/)
        .messages({
            "string.pattern.base": "Phone number must be a valid Indonesian number.",
        }),
    avatar: Joi.string().uri().allow(null, "").messages({
        "string.uri": "Avatar must be a valid URL.",
    }),
})
    .min(1)
    .messages({
        "object.min": "At least one field must be provided to update.",
    });

const accountSchema = Joi.object({
    // konfirmasi password sebelum hapus akun
    password: Joi.string().required().messages({
        "string.empty": "Password is required to delete account.",
        "any.required": "Password is required to delete account.",
    }),
});

const profileSchema = Joi.object({}).unknown(false);

export {
    registerSchema,
    loginSchema,
    logoutSchema,
    forgotpasswordSchema,
    resetpasswordSchema,
    verifyemailSchema,
    resendverificationSchema,
    updateprofileSchema,
    accountSchema,
    profileSchema,
};

