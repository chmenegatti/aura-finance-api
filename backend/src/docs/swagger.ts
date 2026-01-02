import swaggerJSDoc from "swagger-jsdoc";

import { config } from "../config/index.js";

const routeFiles = process.env.NODE_ENV === "production" ? "dist/routes/*.js" : "src/routes/*.ts";

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Aura Finance API",
    version: "0.1.0",
    description: "API que expõe endpoints de autenticação e perfil para a SPA Aura Finance",
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api`,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AuthRegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Joana" },
          email: { type: "string", format: "email", example: "joana@exemplo.com" },
          password: { type: "string", format: "password", example: "s3nh@F0rte" },
        },
      },
      AuthLoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "joana@exemplo.com" },
          password: { type: "string", format: "password", example: "s3nh@F0rte" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "object",
            properties: {
              user: { $ref: "#/components/schemas/User" },
              token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5c" },
            },
          },
        },
      },
      AuthTokenResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "object",
            properties: {
              token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5c" },
            },
          },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "object",
            properties: {
              user: { $ref: "#/components/schemas/User" },
            },
          },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          icon: { type: "string" },
          color: { type: "string", example: "#ff8a65" },
          type: {
            type: "string",
            enum: ["INCOMING", "OUTCOMING"],
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CategoryCreateRequest: {
        type: "object",
        required: ["name", "icon", "color", "type"],
        properties: {
          name: { type: "string", example: "Salary" },
          icon: { type: "string", example: "wallet" },
          color: { type: "string", example: "#00b894" },
          type: {
            type: "string",
            enum: ["INCOMING", "OUTCOMING"],
          },
        },
      },
      CategoryUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Salary" },
          icon: { type: "string", example: "wallet" },
          color: { type: "string", example: "#00b894" },
          type: {
            type: "string",
            enum: ["INCOMING", "OUTCOMING"],
          },
        },
      },
      CategoryResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "object",
            properties: {
              category: { $ref: "#/components/schemas/Category" },
            },
          },
        },
      },
      CategoryListResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "object",
            properties: {
              categories: {
                type: "array",
                items: { $ref: "#/components/schemas/Category" },
              },
            },
          },
        },
      },
      Transaction: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          description: { type: "string" },
          amount: { type: "string", example: "1234.56" },
          type: { type: "string", enum: ["INCOME", "EXPENSE"] },
          date: { type: "string", format: "date-time" },
          category: { $ref: "#/components/schemas/Category" },
          categoryId: { type: "string", format: "uuid" },
          paymentMethod: { type: "string" },
          isRecurring: { type: "boolean" },
          notes: { type: "string", nullable: true },
          receiptUrl: { type: "string", nullable: true },
          userId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      TransactionCreateRequest: {
        type: "object",
        required: ["description", "amount", "type", "categoryId", "date", "paymentMethod"],
        properties: {
          description: { type: "string", example: "Salário de Janeiro" },
          amount: { type: "number", example: 4500 },
          type: { type: "string", enum: ["INCOME", "EXPENSE"] },
          categoryId: { type: "string", format: "uuid" },
          date: { type: "string", format: "date-time" },
          paymentMethod: { type: "string", example: "PIX" },
          isRecurring: { type: "boolean" },
          notes: { type: "string" },
          receiptUrl: { type: "string" },
        },
      },
      TransactionUpdateRequest: {
        type: "object",
        properties: {
          description: { type: "string" },
          amount: { type: "number" },
          type: { type: "string", enum: ["INCOME", "EXPENSE"] },
          categoryId: { type: "string", format: "uuid" },
          date: { type: "string", format: "date-time" },
          paymentMethod: { type: "string" },
          isRecurring: { type: "boolean" },
          notes: { type: "string" },
          receiptUrl: { type: "string" },
        },
      },
      TransactionResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "object",
            properties: {
              transaction: { $ref: "#/components/schemas/Transaction" },
            },
          },
        },
      },
      TransactionListResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "object",
            properties: {
              transactions: {
                type: "array",
                items: { $ref: "#/components/schemas/Transaction" },
              },
              page: { type: "integer", example: 1 },
              pageSize: { type: "integer", example: 20 },
              total: { type: "integer", example: 100 },
              totalPages: { type: "integer", example: 5 },
            },
          },
        },
      },
      RecurringExpense: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          description: { type: "string" },
          amount: { type: "string", example: "299.99" },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time", nullable: true },
          frequency: { type: "string", enum: ["MONTHLY", "YEARLY", "CUSTOM"] },
          customIntervalDays: { type: "integer", nullable: true },
          totalInstallments: { type: "integer" },
          currentInstallment: { type: "integer" },
          type: { type: "string", enum: ["FINANCING", "LOAN", "SUBSCRIPTION", "OTHER"] },
          lastGeneratedAt: { type: "string", format: "date-time", nullable: true },
          userId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RecurringExpenseCreateRequest: {
        type: "object",
        required: ["description", "amount", "startDate", "frequency", "totalInstallments", "type"],
        properties: {
          description: { type: "string", example: "Plano de assinatura" },
          amount: { type: "number", example: 199.9 },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
          frequency: { type: "string", enum: ["MONTHLY", "YEARLY", "CUSTOM"] },
          customIntervalDays: { type: "integer" },
          totalInstallments: { type: "integer", example: 12 },
          currentInstallment: { type: "integer", example: 1 },
          type: { type: "string", enum: ["FINANCING", "LOAN", "SUBSCRIPTION", "OTHER"] },
        },
      },
      RecurringExpenseUpdateRequest: {
        type: "object",
        properties: {
          description: { type: "string" },
          amount: { type: "number" },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time", nullable: true },
          frequency: { type: "string", enum: ["MONTHLY", "YEARLY", "CUSTOM"] },
          customIntervalDays: { type: "integer", nullable: true },
          totalInstallments: { type: "integer" },
          currentInstallment: { type: "integer" },
          type: { type: "string", enum: ["FINANCING", "LOAN", "SUBSCRIPTION", "OTHER"] },
        },
      },
      RecurringExpenseResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "object",
            properties: {
              recurringExpense: { $ref: "#/components/schemas/RecurringExpense" },
            },
          },
        },
      },
      RecurringExpenseListResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: { $ref: "#/components/schemas/RecurringExpense" },
              },
              page: { type: "integer", example: 1 },
              pageSize: { type: "integer", example: 20 },
              total: { type: "integer", example: 10 },
              totalPages: { type: "integer", example: 1 },
            },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string", example: "Descrição clara do erro" },
          details: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [routeFiles],
};

export const swaggerSpec = swaggerJSDoc(options);
