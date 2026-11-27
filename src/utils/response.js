export const successResponse = (
    res,
    message,
    data = null,
    statusCode = 200,
    pagination = null
) => {
    return res.status(statusCode).json({
        code: statusCode,
        status: "OK",
        message,
        pagination,
        data,
        errors: null
    });
};