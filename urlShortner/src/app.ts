import express from "express";
import apiRoutes from "./routes/urlRoutes";
import redirectRoutes from "./routes/redirectRoutes";

const app = express();
app.use(express.json());

// API endpoints
app.use("/api", apiRoutes);

// Redirect route
app.use("/", redirectRoutes);

export default app;
