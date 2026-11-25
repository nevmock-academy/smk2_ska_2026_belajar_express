import BaseRoutes from "../../base_classes/base_routes.js";
import validateCredentials from "../../middleware/validate_credentials_middleware.js";
import tryCatch from "../../middleware/try_catcher.js";
import authMiddleware from "../../middleware/auth_middleware.js";
import CctvController from "./cctv_controller.js";
import { createCctvSchema, updateCctvSchema } from "./cctv_schema.js";

class CCTVRoutes extends BaseRoutes {
    routes() {
        this.router.use(authMiddleware);

        this.router.get("/", [
            tryCatch(CctvController.list)
        ]);
        this.router.get("/:id", [
            tryCatch(CctvController.getById)
        ]);
        this.router.post("/", [
            validateCredentials(createCctvSchema),
            tryCatch(CctvController.create)
        ]);
        this.router.put("/:id", [
            validateCredentials(updateCctvSchema),
            tryCatch(CctvController.update)
        ]);
        this.router.delete("/:id", [
            tryCatch(CctvController.remove)
        ]);
    }
}

export default new CCTVRoutes().router;
