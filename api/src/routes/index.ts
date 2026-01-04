import { Router } from "express";

import authRoutes from "../modules/auth/routes.js";
import categoryRoutes from "../modules/category/routes.js";
import creditCardRoutes from "../modules/credit-cards/routes.js";
import transactionRoutes from "../modules/transaction/routes.js";
import userRoutes from "../modules/users/routes.js";
import recurringExpenseRoutes from "../modules/recurring-expense/routes.js";
import dashboardRoutes from "../modules/dashboard/routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/credit-cards", creditCardRoutes);
router.use("/transactions", transactionRoutes);
router.use("/recurring-expenses", recurringExpenseRoutes);
router.use("/users", userRoutes);
router.use("/dashboard", dashboardRoutes);

export { router };
