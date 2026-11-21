import express from "express";
import routes from "./routes.js";
import apicache from "apicache"
import errorHandler from "./middleware/global_error_handler_middleware.js";
import "dotenv/config"
import logger from "./utils/logger.js";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import BaseError from "./base_classes/base_error.js";
import cookieParser from "cookie-parser";

class OurExpressApplication {
    app;
    port;

    constructor(port) {
        this.app = express();
        this.port = port;

        this.configureAssets();
        this.setupMiddlewares([
            express.json(),
            express.urlencoded({ extended: true }),
            apicache.middleware("5 minutes"),
            cookieParser(),
        ]);
        this.setupLibrary([
            process.env.NODE_ENV === "development" ? morgan("dev") : "",
            compression(),
            helmet(),
        ]);
        this.setupRoute();
        this.app.use(errorHandler);
    }

    setupRoute(){
        this.app.use("/api/", routes);

        this.app.use("/{*splat}", (req, res) => {
            throw BaseError.notFound("Route not found");
        });
    }

    setupMiddlewares(middlewaresArr) {
        middlewaresArr.forEach((middleware) => {
            this.app.use(middleware);
        });
    }

    configureAssets(){}

    setupLibrary(libraries){
        libraries.forEach((library) => {
            if (library != "" && library != null) {
                this.app.use(library);
            }
        });
    }

    start(){
        this.app.listen(this.port, () => {
            logger.info(`Application running on port ${this.port}`);
        });
    }
}

export default OurExpressApplication;
