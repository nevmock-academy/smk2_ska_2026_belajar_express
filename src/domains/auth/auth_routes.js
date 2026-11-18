import BaseRoutes from "../../base_classes/base_routes.js";
import { registerSchema } from "./auth_schema.js";
import validateCredentials from "../../middleware/validate_credentials_middleware.js";
import tryCatch from "../../middleware/try_catcher.js";
import AuthController from "./auth_controller.js"

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
            validateCredentials(logoutSchema),
            tryCatch(AuthController.logout)
        ]);
        this.router.post("/forgotpassword", [
            validateCredentials(forgotpasswordSchema),
            tryCatch(AuthController.forgotpassword)
        ]);
        this.router.post("/resetpassword", [
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
            validateCredentials(forgotpasswordSchema),
            tryCatch(AuthController.reset-password)
        ]);
        this.router.delete("/account", [
            validateCredentials(accountSchema),
            tryCatch(AuthController.account)
        ])

    }
}

export default new AuthRoutes().router;
    