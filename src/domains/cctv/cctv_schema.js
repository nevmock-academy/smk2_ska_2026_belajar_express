import Joi from "joi";

const url = Joi.string()
    .uri({ scheme: ["rtsp", "rtsps", "http", "https"] })
    .max(500)
    .messages({
        "string.empty": "URL is required.",
        "string.uri": "URL must be a valid rtsp:// or http(s):// address.",
        "string.uriCustomScheme": "URL must be a valid rtsp:// or http(s):// address.",
        "any.required": "URL is required.",
    });

const type = Joi.string().valid("RTSP", "STREAM").messages({
    "any.only": "Type must be RTSP or STREAM.",
    "any.required": "Type is required.",
});

const latitude = Joi.number().min(-90).max(90).messages({
    "number.base": "Latitude must be a number.",
    "number.min": "Latitude must be between -90 and 90.",
    "number.max": "Latitude must be between -90 and 90.",
    "any.required": "Latitude is required.",
});

const longitude = Joi.number().min(-180).max(180).messages({
    "number.base": "Longitude must be a number.",
    "number.min": "Longitude must be between -180 and 180.",
    "number.max": "Longitude must be between -180 and 180.",
    "any.required": "Longitude is required.",
});

const owner = Joi.string().trim().min(2).max(100).messages({
    "string.empty": "Owner is required.",
    "string.min": "Owner must be at least 2 characters long.",
    "string.max": "Owner must not exceed 100 characters.",
    "any.required": "Owner is required.",
});

const status = Joi.string().valid("ON", "OFF").messages({
    "any.only": "Status must be ON or OFF.",
});

export const createCctvSchema = Joi.object({
    url: url.required(),
    type: type.required(),
    latitude: latitude.required(),
    longitude: longitude.required(),
    owner: owner.required(),
    status: status.default("OFF"),
}).required().messages({
    "any.required": "Request body is required.",
});

export const updateCctvSchema = Joi.object({
    url,
    type,
    latitude,
    longitude,
    owner,
    status,
})
    .min(1)
    .messages({
        "object.min": "At least one field must be provided to update.",
    });

export const listCctvQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid("ON", "OFF"),
    type: Joi.string().valid("RTSP", "STREAM"),
    owner: Joi.string().trim().max(100),
});

export const cctvIdSchema = Joi.number().integer().positive().required().messages({
    "number.base": "CCTV id must be a number.",
    "number.integer": "CCTV id must be an integer.",
    "number.positive": "CCTV id must be a positive number.",
});
