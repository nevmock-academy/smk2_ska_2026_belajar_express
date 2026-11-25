import UserService from "./user_service.js";
import { successResponse } from "../../utils/response.js";

class UserController {
    async getAll(_req, res) {
        const users = await UserService.getAll();

        return successResponse(res, "Daftar pengguna berhasil diambil", users);
    }

    async getById(req, res) {
        const data = req.params.id;
        const user = await UserService.getById(data);

        return successResponse(res, "Detail pengguna berhasil diambil", user);
    }

    async create(req, res) {
        const data = req.body;
        const user = await UserService.create(data);

        return successResponse(res, "Pengguna berhasil dibuat", user, 201);
    }

    async update(req, res) {
        const data = req.body
        const id = req.params.id;
        const user = await UserService.update(id, data);

        return successResponse(res, "Pengguna berhasil diperbarui", user);
    }

    async remove(req, res) {
        const data = req.params.id;
        await UserService.remove(data);

        return successResponse(res, "Pengguna berhasil dihapus");
    }
}

export default new UserController();