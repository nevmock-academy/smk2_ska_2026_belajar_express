import BaseError from "../../base_classes/base_error.js";
import { cctvList, violations } from "./contraflow_mock.js";

function findCctvByName(cctvName) {
    const normalizedName = cctvName.toLocaleLowerCase("id");

    const cctv = cctvList.find(
        (item) => item.nama.toLocaleLowerCase("id") === normalizedName
    );

    if (!cctv) {
        throw BaseError.notFound("CCTV not found");
    }

    return cctv;
}

function paginate(items, page, limit) {
    const total = items.length;

    return {
        data: items.slice((page - 1) * limit, page * limit),
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

function toResponse(violation, cctv) {
    return {
        id: violation.id,
        cctvId: violation.cctvId,
        cctv: cctv.nama,
        screenshotUrl: `/uploads/${violation.imageKey.replace(/^\/+/, "")}`,
        waktu: violation.occurredAt.toISOString().slice(11, 19),
        tanggal: violation.occurredAt.toISOString().slice(0, 10),
        platNomor: violation.plateNumber,
        sebab: violation.description,
    };
}

function sortNewestFirst(a, b) {
    return b.occurredAt.getTime() - a.occurredAt.getTime();
}

class ContraflowService {
    async listCctv(search = "") {
        const keyword = search.toLocaleLowerCase("id");

        return cctvList
            .filter((cctv) =>
                cctv.nama.toLocaleLowerCase("id").includes(keyword)
            )
            .sort((a, b) =>
                a.nama.localeCompare(b.nama, "id", { sensitivity: "base" })
            )
            .map(({ id, nama }) => ({ id, nama }));
    }

    async image() {
        return [...violations]
            .sort(sortNewestFirst)
            .map((violation) => {
                const cctv = cctvList.find(
                    (item) => item.id === violation.cctvId
                );

                if (!cctv) {
                    throw BaseError.notFound("CCTV for violation not found");
                }

                return toResponse(violation, cctv);
            });
    }

    async listDailyViolations({ cctvName, startDate, endDate, page, limit}) {
        if (startDate > endDate) {
            throw BaseError.badRequest(
                "startDate must be on or before endDate"
            );
        }

        const cctv = findCctvByName(cctvName);

        const filteredResults = violations
            .filter((violation) => {
                const date = violation.occurredAt.toISOString().slice(0, 10);

                return (
                    violation.cctvId === cctv.id &&
                    date >= startDate &&
                    date <= endDate
                );
            })
            .sort(sortNewestFirst)
            .map((violation) => toResponse(violation, cctv));

        return paginate(filteredResults, page, limit);
    }

    async listMonthlyViolations({ cctvName, month, year, page, limit }) {
        const cctv = findCctvByName(cctvName);

        const filteredResults = violations
            .filter(
                (violation) =>
                    violation.cctvId === cctv.id &&
                    violation.occurredAt.getUTCMonth() + 1 === month &&
                    violation.occurredAt.getUTCFullYear() === year
            )
            .sort(sortNewestFirst)
            .map((violation) => toResponse(violation, cctv));

        return paginate(filteredResults, page, limit);
    }
}

export default new ContraflowService();