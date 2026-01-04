import cors from "cors";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { config } from "./config/index.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { swaggerSpec } from "./docs/swagger.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors({ origin: config.corsOrigins }));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", router);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
