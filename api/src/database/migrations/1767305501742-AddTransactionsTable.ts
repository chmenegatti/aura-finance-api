import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransactionsTable1767305501742 implements MigrationInterface {
    name = 'AddTransactionsTable1767305501742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar(255) NOT NULL, "amount" decimal(14,2) NOT NULL, "type" text NOT NULL, "date" datetime NOT NULL, "paymentMethod" varchar NOT NULL, "isRecurring" boolean NOT NULL DEFAULT (0), "notes" text, "receiptUrl" text, "categoryId" varchar NOT NULL, "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_transactions" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar(255) NOT NULL, "amount" decimal(14,2) NOT NULL, "type" text NOT NULL, "date" datetime NOT NULL, "paymentMethod" varchar NOT NULL, "isRecurring" boolean NOT NULL DEFAULT (0), "notes" text, "receiptUrl" text, "categoryId" varchar NOT NULL, "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_86e965e74f9cc66149cf6c90f64" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_transactions"("id", "description", "amount", "type", "date", "paymentMethod", "isRecurring", "notes", "receiptUrl", "categoryId", "userId", "createdAt", "updatedAt") SELECT "id", "description", "amount", "type", "date", "paymentMethod", "isRecurring", "notes", "receiptUrl", "categoryId", "userId", "createdAt", "updatedAt" FROM "transactions"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`ALTER TABLE "temporary_transactions" RENAME TO "transactions"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" RENAME TO "temporary_transactions"`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar(255) NOT NULL, "amount" decimal(14,2) NOT NULL, "type" text NOT NULL, "date" datetime NOT NULL, "paymentMethod" varchar NOT NULL, "isRecurring" boolean NOT NULL DEFAULT (0), "notes" text, "receiptUrl" text, "categoryId" varchar NOT NULL, "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "transactions"("id", "description", "amount", "type", "date", "paymentMethod", "isRecurring", "notes", "receiptUrl", "categoryId", "userId", "createdAt", "updatedAt") SELECT "id", "description", "amount", "type", "date", "paymentMethod", "isRecurring", "notes", "receiptUrl", "categoryId", "userId", "createdAt", "updatedAt" FROM "temporary_transactions"`);
        await queryRunner.query(`DROP TABLE "temporary_transactions"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
    }

}
