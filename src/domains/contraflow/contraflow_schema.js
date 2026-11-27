import Joi from "joi";

const listCctvQuerySchema = Joi.object({
    search: Joi.string().trim().max(100).allow("").default(""),
});

const dailyViolationQuerySchema = Joi.object({
    cctvName: Joi.string().trim().min(1).max(100).required(),
    startDate: Joi.string().isoDate().required(),
    endDate: Joi.string().isoDate().required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(15).default(15),
});

const monthlyViolationQuerySchema = Joi.object({
    cctvName: Joi.string().trim().min(1).max(100).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2000).max(2100).required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(15).default(15),
});

export {
    listCctvQuerySchema,
    dailyViolationQuerySchema,
    monthlyViolationQuerySchema,
};