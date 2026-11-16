import StatusCodes from "../constants/status_codes.js";

class BaseError extends Error {
    constructor({ code, codeName, message, errorName }) {
        super(message);
        this.statusCode = code;
        this.errorCode = codeName;
        this.errorName = errorName;
    }

    static notFound(message = "Resource does not exist") {
        return new BaseError({
            ...StatusCodes.NOT_FOUND,
            errorName: "Resource Not Found",
            message,
        });
    }

    static badRequest(message = "Bad Request") {
        return new BaseError({
            ...StatusCodes.BAD_REQUEST,
            errorName: "Bad Request",
            message,
        });
    }

    static unauthorized(message = "Unauthorized") {
        return new BaseError({
            ...StatusCodes.UNAUTHORIZED,
            errorName: "Unauthorized",
            message,
        });
    }

    static forbidden(message = "Forbidden") {
        return new BaseError({
            ...StatusCodes.FORBIDDEN,
            errorName: "Forbidden",
            message,
        });
    }

    static serviceUnavailable(message = "Service Unavailable") {
        return new BaseError({
            ...StatusCodes.SERVICE_UNAVAILABLE,
            errorName: "Service Unavailable",
            message,
        });
    }

    static badGateway(errorName, message = "Service Unavailable") {
        return new BaseError({
            ...StatusCodes.BAD_GATEWAY,
            errorName: errorName,
            message,
        });
    }

    static invalidParams(message = "Invalid Parameters") {
        return new BaseError({
            ...StatusCodes.INVALID_PARAMS,
            errorName: "Invalid Parameters",
            message,
        });
    }

    static duplicate(message = "Duplicate Found") {
        return new BaseError({
            ...StatusCodes.DUPLICATE,
            errorName: "Duplicate Found",
            message,
        });
    }

    static internalServer(message = "Internal Server Error") {
        return new BaseError({
            ...StatusCodes.INTERNAL_SERVER_ERROR,
            errorName: "Internal Server Error",
            message,
        });
    }
}

export default BaseError;
