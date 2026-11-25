import BaseRoutes from "../../base_classes/base_routes.js";
import validateCredentials from "../../middleware/validate_credentials_middleware.js";
import tryCatch from "../../middleware/try_catcher.js";
import UserController from "./user_controller.js";
import { createUserSchema, updateUserSchema } from "./user_schema.js";

class UserRoutes extends BaseRoutes {
    routes() {
        this.router.get("/", [
            tryCatch(UserController.getAll),
        ]);
        
        this.router.get("/:id", [
            tryCatch(UserController.getById),
        ]);

        this.router.post("/", [
            validateCredentials(createUserSchema),
            tryCatch(UserController.create),
        ]);

        this.router.patch("/:id", [
            validateCredentials(updateUserSchema),
            tryCatch(UserController.update),
        ]);

        this.router.delete("/:id", [
            tryCatch(UserController.remove),
        ]);
    }
}

export default new UserRoutes().router;