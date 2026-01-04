import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../../../types/authenticated-request.js";
import { CreditCardService } from "../services/credit-card.service.js";
import { CreateCreditCardDto } from "../dtos/credit-card-create.dto.js";
import { UpdateCreditCardDto } from "../dtos/credit-card-update.dto.js";
import { CreditCardParamsDto } from "../dtos/credit-card-params.dto.js";

const creditCardService = new CreditCardService();

export const createCreditCard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const payload = req.body as CreateCreditCardDto;
    const userId = req.user?.id ?? "";
    const creditCard = await creditCardService.create(userId, payload);

    return res.status(201).json({
      status: "success",
      data: {
        creditCard,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const listCreditCards = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = _req.user?.id ?? "";
    const creditCards = await creditCardService.list(userId);

    return res.status(200).json({
      status: "success",
      data: {
        creditCards,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCreditCard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const params = req.params as unknown as CreditCardParamsDto;
    const userId = req.user?.id ?? "";
    const creditCard = await creditCardService.get(userId, params.id);

    return res.status(200).json({
      status: "success",
      data: {
        creditCard,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCreditCard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const params = req.params as unknown as CreditCardParamsDto;
    const payload = req.body as UpdateCreditCardDto;
    const userId = req.user?.id ?? "";
    const creditCard = await creditCardService.update(userId, params.id, payload);

    return res.status(200).json({
      status: "success",
      data: {
        creditCard,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCreditCard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const params = req.params as unknown as CreditCardParamsDto;
    const userId = req.user?.id ?? "";
    await creditCardService.remove(userId, params.id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
