import BaseRoutes from "../../base_classes/base_routes.js";
import authMiddleware from "../../middleware/auth_middleware.js";
import tryCatch from "../../middleware/try_catcher.js";
import ContraflowController from "./contraflow_controller.js";

class ContraflowRoutes extends BaseRoutes {
    routes() {
        this.router.use(authMiddleware);

        this.router.get("/cctv", [
            tryCatch(ContraflowController.listCctv),
        ]);
        this.router.get("/image", [
            tryCatch(ContraflowController.image),
        ]);
        this.router.get("/violations/daily", [
        tryCatch(ContraflowController.listDailyViolations),
        ]);
        this.router.get("/violations/monthly", [
            tryCatch(ContraflowController.listMonthlyViolations),
        ]);
    }
}

export default new ContraflowRoutes().router;