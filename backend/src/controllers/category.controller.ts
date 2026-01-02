import { instanceToPlain } from "class-transformer";
import { NextFunction, Request, Response } from "express";

import { CategoryService } from "../services/category.service.js";
import { CreateCategoryDto } from "../dtos/category-create.dto.js";
import { UpdateCategoryDto } from "../dtos/category-update.dto.js";
import { CategoryParamsDto } from "../dtos/category-params.dto.js";

const categoryService = new CategoryService();

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAll();

    return res.status(200).json({
      status: "success",
      data: {
        categories: instanceToPlain(categories),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as unknown as CategoryParamsDto;
    const category = await categoryService.getById(id);

    return res.status(200).json({
      status: "success",
      data: {
        category: instanceToPlain(category),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.create(req.body as CreateCategoryDto);

    return res.status(201).json({
      status: "success",
      data: {
        category: instanceToPlain(category),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as unknown as CategoryParamsDto;
    const category = await categoryService.update(id, req.body as UpdateCategoryDto);

    return res.status(200).json({
      status: "success",
      data: {
        category: instanceToPlain(category),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as unknown as CategoryParamsDto;
    await categoryService.delete(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
