import ContraflowService from "./contraflow_service.js";
import { successResponse } from "../../utils/response.js";
import { 
    listCctvQuerySchema,
    dailyViolationQuerySchema,
    monthlyViolationQuerySchema,

 } from "./contraflow_schema.js";

function parseQuery(req, schema) {
    const { error, value } = schema.validate(req.query, {
        abortEarly: false,
        convert: true,
    });

    if (error) {
        error.source = "query";
        throw error;
    }

    return value;
}

class ContraflowController {
    async listCctv(req, res) {
    const { search } = parseQuery(req, listCctvQuerySchema);
    const data = await ContraflowService.listCctv(search);

    return successResponse(res, "CCTV list fetched successfully", data);
}

async image(req, res) {
    const data = await ContraflowService.image();

    return successResponse(res, "Violations fetched successfully", data);
}

async listDailyViolations(req, res) {
    const filters = parseQuery(req, dailyViolationQuerySchema);
    const { data, pagination } = await ContraflowService.listDailyViolations(filters);

    return successResponse(
        res,
        "Daily violations fetched successfully",
        data,
        200,
        pagination
    );
}

async listMonthlyViolations(req, res) {
    const filters = parseQuery(req, monthlyViolationQuerySchema);
    const { data, pagination } = await ContraflowService.listMonthlyViolations(filters);

        return successResponse(
        res,
        "Monthlyviolations fetched successfully",
        data,
        200,
        pagination
    );
}
}

export default new ContraflowController();