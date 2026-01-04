import "reflect-metadata";

import { app } from "./app.js";
import { AppDataSource } from "./database/data-source.js";
import { config } from "./config/index.js";

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    app.listen(config.port, () => {
      console.log(`Server is running at http://localhost:${config.port}/api`);
    });
  } catch (error) {
    console.error("Failed to start application", error);
    process.exit(1);
  }
};

startServer();
