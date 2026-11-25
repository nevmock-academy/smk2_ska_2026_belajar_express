import Joi from "joi";

const password = Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .messages({
        "string.min": "Password must be at least 8 characters long.",
        "string.pattern.base":
            "Password must contain at least 8 characters, one uppercase letter, and one special character.",
    });

const createUserSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().email().required(),
    password: password.required(),
})
    .required()
    .unknown(false);

const updateUserSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    email: Joi.string().trim().email(),
    password,
})
    .min(1)
    .required()
    .unknown(false);

export {
    createUserSchema,
    updateUserSchema,
};