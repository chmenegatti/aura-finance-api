import { Router } from "express";

import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import transactionRoutes from "./transaction.routes.js";
import userRoutes from "./user.routes.js";
import recurringExpenseRoutes from "./recurring-expense.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/transactions", transactionRoutes);
router.use("/recurring-expenses", recurringExpenseRoutes);
router.use("/users", userRoutes);

export { router };
