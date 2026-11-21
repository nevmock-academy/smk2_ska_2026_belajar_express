import AuthService from "./auth_service.js";
import { successResponse } from "../../utils/response.js";

class AuthController {
    async register(req, res) {
        const data = req.body;

        const message = await AuthService.register(data);

        return successResponse(
            res,
            "User registered successfully",
            message,
            201
        );                                                                              
    }

    async login(req, res) {
        const data = req.body;
        const message = await AuthService.login(data);

        return successResponse(res, "User logged in successfully", message);
    }

    async logout(req, res) {
        const data = req.body;
        const message = await AuthService.logout(data);

        return successResponse(res, "User logged out successfully", message);
    }

    async forgotpassword(req, res) {
        const data = req.body;
        const message = await AuthService.forgotpassword(data);

        return successResponse(res, "Password reset request sent successfully", message);
    }

    async resetpassword(req, res) {
        const data = req.body;
        const message = await AuthService.resetpassword(data);

        return successResponse(res, "Password reset successfully", message);
    }

    async verifyemail(req, res) {
        const data = req.body;
        const message = await AuthService.verifyemail(data);

        return successResponse(res, "Email verified successfully", message);
    }

    async resendverification(req, res) {
        const data = req.body;
        const message = await AuthService.resendverification(data);

        return successResponse(res, "Verification email sent successfully", message);
    }

    async updateprofile(req, res) {
        const data = req.body;
        const message = await AuthService.updateprofile(data);

        return successResponse(res, "Profile updated successfully", message);
    }

    async account(req, res) {
        const data = req.body;
        const message = await AuthService.account(data);

        return successResponse(res, "Account deleted successfully", message);
    }

    async profile(req, res){
        const data ={ userId: req.user.userId };
        const message = await AuthService.profile(data);

        return successResponse(res, "profile dibuka", message);
        
    }
}

export default new AuthController();
