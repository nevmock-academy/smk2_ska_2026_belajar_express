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
    }
}

export default new AuthRoutes().router;
