export const successResponse = (
    res,
    message,
    data = null,
    statusCode = 200
) => {
    return res.status(statusCode).json({
        code: statusCode,
        status: "OK",
        message,
        pagination: null,
        data,
        errors: null
    });
};