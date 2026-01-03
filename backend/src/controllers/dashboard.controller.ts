import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../types/authenticated-request.js";
import { DashboardService } from "../services/dashboard.service.js";
import { DashboardParamsDto } from "../dtos/dashboard-params.dto.js";

const dashboardService = new DashboardService();

export const getDashboardSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = req.query as DashboardParamsDto;
    const summary = await dashboardService.getSummary(req.user?.id ?? "", params);

    return res.status(200).json({
      status: "success",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardCharts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = req.query as DashboardParamsDto;
    const charts = await dashboardService.getCharts(req.user?.id ?? "", params);

    return res.status(200).json({
      status: "success",
      data: charts,
    });
  } catch (error) {
    next(error);
  }
};
