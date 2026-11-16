import OurApp from "./app.js";
import logger from "./utils/logger.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

const ourApp = new OurApp(PORT);
const server = ourApp.start();

process.on("SIGTERM", () => {
    logger.warn("SIGTERM RECEIVED!");
    server.close(() => {
        logger.warn("Process Terminated!");
    });
});


