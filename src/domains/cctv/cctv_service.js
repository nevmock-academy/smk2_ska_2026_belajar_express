import prisma from "../../libs/prisma.js";
import BaseError from "../../base_classes/base_error.js";

const ALLOWED_PROTOCOLS = {
    RTSP: ["rtsp:", "rtsps:"],
    STREAM: ["http:", "https:"],
};

// ON = hijau, OFF = merah (dipakai frontend untuk warna marker)
const STATUS_COLOR = {
    ON: "green",
    OFF: "red",
};

const serialize = (cctv) => ({
    ...cctv,
    statusColor: STATUS_COLOR[cctv.status],
});

function assertUrlMatchesType(type, url) {
    const { protocol } = new URL(url);

    if (!ALLOWED_PROTOCOLS[type].includes(protocol)) {
        throw BaseError.badRequest(
            `URL for type ${type} must start with ${ALLOWED_PROTOCOLS[type]
                .map((p) => `${p}//`)
                .join(" or ")}`
        );
    }
}

async function findOrFail(id) {
    const cctv = await prisma.cctv.findUnique({ where: { id } });

    if (!cctv) {
        throw BaseError.notFound("CCTV not found");
    }

    return cctv;
}

class CctvService {
    async list({ page, limit, status, type, owner, search, sort }) {
        const where = {
            ...(status && { status }),
            ...(type && { type }),
            ...(owner && { owner: { contains: owner, mode: "insensitive" } }),
            ...(search && { code: { contains: search, mode: "insensitive"} }),
        };

        const [total, rows] = await prisma.$transaction([
            prisma.cctv.count({ where }),
            prisma.cctv.findMany({
                where,
                orderBy: { id: "asc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);

        return {
            data: rows.map(serialize),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getById(id) {
        return serialize(await findOrFail(id));
    }

    async create(data) {
        const { url, type, latitude, longitude, owner, status } = data;

        assertUrlMatchesType(type, url);

        const cctv = await prisma.cctv.create({
            data: {
                url: url.trim(),
                type,
                latitude,
                longitude,
                owner: owner.trim(),
                status: status ?? "OFF",
            },
        });

        return serialize(cctv);
    }

    async update(id, data) {
        const existing = await findOrFail(id);

        const nextType = data.type ?? existing.type;
        const nextUrl = data.url ?? existing.url;

        // cek ulang kalau url ATAU type berubah
        if (data.url !== undefined || data.type !== undefined) {
            assertUrlMatchesType(nextType, nextUrl);
        }

        const cctv = await prisma.cctv.update({
            where: { id },
            data: {
                ...(data.url !== undefined && { url: data.url.trim() }),
                ...(data.type !== undefined && { type: data.type }),
                ...(data.latitude !== undefined && { latitude: data.latitude }),
                ...(data.longitude !== undefined && { longitude: data.longitude }),
                ...(data.owner !== undefined && { owner: data.owner.trim() }),
                ...(data.status !== undefined && { status: data.status }),
            },
        });

        return serialize(cctv);
    }

    async remove(id) {
        await findOrFail(id);
        await prisma.cctv.delete({ where: { id } });

        return { id };
    }

}

export default new CctvService();
