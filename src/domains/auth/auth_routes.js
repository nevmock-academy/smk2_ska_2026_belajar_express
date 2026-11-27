import BaseRoutes from "../../base_classes/base_routes.js";
import validateCredentials from "../../middleware/validate_credentials_middleware.js";
import tryCatch from "../../middleware/try_catcher.js";
import AuthController from "./auth_controller.js"
import authMiddleware from "../../middleware/auth_middleware.js";
import resetTokenMiddleware from "../../middleware/reset_token_middleware.js";

import {
    registerSchema,
    loginSchema,
    logoutSchema,
    forgotpasswordSchema,
    resetpasswordSchema,
    verifyemailSchema,
    resendverificationSchema,
    updateprofileSchema,
    accountSchema,
    profileSchema,
    verifyotpSchema
} from "./auth_schema.js";

class AuthRoutes extends BaseRoutes {
    routes() {
        this.router.post("/register", [
            validateCredentials(registerSchema),
            tryCatch(AuthController.register)
        ]);
        this.router.post("/login", [
            validateCredentials(loginSchema),
            tryCatch(AuthController.login)
        ]);
        this.router.post("/logout", [
            tryCatch(AuthController.logout)
        ]);
        this.router.post("/forgotpassword", [
            validateCredentials(forgotpasswordSchema),
            tryCatch(AuthController.forgotpassword)
        ]);
        this.router.post("/verifyotp", [
            resetTokenMiddleware("forgot_password"),
            validateCredentials(verifyotpSchema),
            tryCatch(AuthController.verifyotp)
        ]);
        this.router.post("/resetpassword", [
            resetTokenMiddleware("reset_password"),
            validateCredentials(resetpasswordSchema),
            tryCatch(AuthController.resetpassword)
        ]);
        this.router.post("/verifyemail", [
            validateCredentials(verifyemailSchema),
            tryCatch(AuthController.verifyemail)
        ]);
        this.router.post("/resendverification", [
            validateCredentials(resendverificationSchema),
            tryCatch(AuthController.resendverification)
        ]);
        this.router.put("/updateprofile", [
            validateCredentials(updateprofileSchema),
            tryCatch(AuthController.updateprofile)
        ]);
        this.router.delete("/account", [
            validateCredentials(accountSchema),
            tryCatch(AuthController.account)
        ]);
        this.router.get("/profile", [
            validateCredentials(profileSchema),
            authMiddleware,
            tryCatch(AuthController.profile)
        ]);
        this.router.post("/refresh", [
            tryCatch(AuthController.refresh)
        ]);
    }
}

export default new AuthRoutes().router;
