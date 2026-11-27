import express from "express";
import authRoutes from "./domains/auth/auth_routes.js";
import cctvRoutes from "./domains/cctv/cctv_routes.js";
import userRoutes from "./domains/user/user_routes.js";
import contraflowRoutes from "./domains/contraflow/contraflow_routes.js";

const router = express.Router();

const appsRoutes = [
    {
        path: "/auth",
        route: authRoutes
    }, 
    {
        path: "/cctv",
        route: cctvRoutes
    },
    {
        path: "/users",
        route: userRoutes
    },
    {
        path: "/contraflow",
        route: contraflowRoutes
    }
];

appsRoutes.forEach(({ path, route }) => {
    router.use(`/v1${path}`, route);
});

export default router;
