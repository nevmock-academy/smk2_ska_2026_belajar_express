import CctvService from "./cctv_service.js";
import { successResponse } from "../../utils/response.js";
import { listCctvQuerySchema, cctvIdSchema } from "./cctv_schema.js";

function parseId(req) {
    const { error, value } = cctvIdSchema.validate(req.params.id);

    if (error) {
        error.source = "params";
        throw error;
    }

    return value;
}

function parseQuery(req) {
    const { error, value } = listCctvQuerySchema.validate(req.query, {
        abortEarly: false,
        convert: true,
    });

    if (error) {
        error.source = "query"; 
        throw error;
    }

    return value;
}

class CctvController {
    async list(req, res) {
        const { data, pagination } = await CctvService.list(parseQuery(req));

        return successResponse(res, "CCTV list fetched successfully", data, 200, pagination);
    }

    async getById(req, res) {
        const data = await CctvService.getById(parseId(req));

        return successResponse(res, "CCTV fetched successfully", data);
    }

    async create(req, res) {
        const data = await CctvService.create(req.body);

        return successResponse(res, "CCTV created successfully", data, 201);
    }

    async update(req, res) {
        const data = await CctvService.update(parseId(req), req.body);

        return successResponse(res, "CCTV updated successfully", data);
    }

    async remove(req, res) {
        const data = await CctvService.remove(parseId(req));

        return successResponse(res, "CCTV deleted successfully", data);
    }
}

export default new CctvController();
