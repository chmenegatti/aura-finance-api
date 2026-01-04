import fs from "node:fs";
import path from "node:path";

import { DataSource } from "typeorm";

import { config } from "../config/index.js";
import { Category } from "../modules/category/entities/category.entity.js";
import { CreditCard } from "../modules/credit-cards/entities/credit-card.entity.js";
import { CreditCardExpense } from "../modules/credit-cards/entities/credit-card-expense.entity.js";
import { RecurringExpense } from "../modules/recurring-expense/entities/recurring-expense.entity.js";
import { Transaction } from "../modules/transaction/entities/transaction.entity.js";
import { User } from "../modules/users/entities/user.entity.js";

const ensureDatabaseDirectory = () => {
  const folder = path.dirname(config.dbPath);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

if (!config.useRemoteDatabase) {
  ensureDatabaseDirectory();
}

const isProduction = config.nodeEnv === "production";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: config.dbPath,
  synchronize: false,
  migrationsRun: false,
  logging: config.nodeEnv === "development",
  entities: isProduction
    ? ["dist/entities/*.js"]
    : [User, Category, CreditCard, CreditCardExpense, Transaction, RecurringExpense],
  migrations: isProduction ? ["dist/database/migrations/*.js"] : ["src/database/migrations/*.ts"],
});
