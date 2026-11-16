import AuthService from "./auth_service.js";

class AuthController {
    async register(req, res) {
        let data = req.body;

        const message = await AuthService.register(data);

        // return successResponse(res, message);
        return res.status(201).json({
            code: 201,
            status: "OK",
            message: "User registered successfully",
            pagination: null,
            data: message,
            errors: null,
        });
    }
}

export default new AuthController();
