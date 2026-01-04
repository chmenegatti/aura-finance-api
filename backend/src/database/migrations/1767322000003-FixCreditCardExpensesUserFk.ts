import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCreditCardExpensesUserFk1767322000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "credit_card_expenses" RENAME TO "credit_card_expenses_old"`);

    await queryRunner.query(`
      CREATE TABLE "credit_card_expenses" (
        "id" uuid PRIMARY KEY NOT NULL,
        "creditCardId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "groupId" varchar(36) NOT NULL,
        "description" varchar(255) NOT NULL,
        "amount" decimal(12,2) NOT NULL,
        "purchaseDate" date NOT NULL,
        "installments" int NOT NULL DEFAULT (1),
        "currentInstallment" int NOT NULL DEFAULT (1),
        "invoiceMonth" varchar(7) NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY ("creditCardId") REFERENCES "credit_cards" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      INSERT INTO "credit_card_expenses" (
        "id",
        "creditCardId",
        "userId",
        "groupId",
        "description",
        "amount",
        "purchaseDate",
        "installments",
        "currentInstallment",
        "invoiceMonth",
        "createdAt"
      )
      SELECT
        "id",
        "creditCardId",
        "userId",
        "groupId",
        "description",
        "amount",
        "purchaseDate",
        "installments",
        "currentInstallment",
        "invoiceMonth",
        "createdAt"
      FROM "credit_card_expenses_old"
    `);

    await queryRunner.query(`DROP TABLE "credit_card_expenses_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "credit_card_expenses" RENAME TO "credit_card_expenses_old"`);

    await queryRunner.query(`
      CREATE TABLE "credit_card_expenses" (
        "id" uuid PRIMARY KEY NOT NULL,
        "creditCardId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "groupId" varchar(36) NOT NULL,
        "description" varchar(255) NOT NULL,
        "amount" decimal(12,2) NOT NULL,
        "purchaseDate" date NOT NULL,
        "installments" int NOT NULL DEFAULT (1),
        "currentInstallment" int NOT NULL DEFAULT (1),
        "invoiceMonth" varchar(7) NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY ("creditCardId") REFERENCES "credit_cards" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      INSERT INTO "credit_card_expenses" (
        "id",
        "creditCardId",
        "userId",
        "groupId",
        "description",
        "amount",
        "purchaseDate",
        "installments",
        "currentInstallment",
        "invoiceMonth",
        "createdAt"
      )
      SELECT
        "id",
        "creditCardId",
        "userId",
        "groupId",
        "description",
        "amount",
        "purchaseDate",
        "installments",
        "currentInstallment",
        "invoiceMonth",
        "createdAt"
      FROM "credit_card_expenses_old"
    `);

    await queryRunner.query(`DROP TABLE "credit_card_expenses_old"`);
  }
}