import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRecurringExpenses1767311810889 implements MigrationInterface {
    name = 'CreateRecurringExpenses1767311810889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recurring_expenses" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar(255) NOT NULL, "amount" decimal(14,2) NOT NULL, "startDate" date NOT NULL, "endDate" date, "frequency" text NOT NULL, "customIntervalDays" integer, "totalInstallments" integer NOT NULL DEFAULT (0), "currentInstallment" integer NOT NULL DEFAULT (0), "type" text NOT NULL, "lastGeneratedAt" datetime, "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_recurring_expenses" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar(255) NOT NULL, "amount" decimal(14,2) NOT NULL, "startDate" date NOT NULL, "endDate" date, "frequency" text NOT NULL, "customIntervalDays" integer, "totalInstallments" integer NOT NULL DEFAULT (0), "currentInstallment" integer NOT NULL DEFAULT (0), "type" text NOT NULL, "lastGeneratedAt" datetime, "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_c3a0703f52dda84b1df25ce1959" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_recurring_expenses"("id", "description", "amount", "startDate", "endDate", "frequency", "customIntervalDays", "totalInstallments", "currentInstallment", "type", "lastGeneratedAt", "userId", "createdAt", "updatedAt") SELECT "id", "description", "amount", "startDate", "endDate", "frequency", "customIntervalDays", "totalInstallments", "currentInstallment", "type", "lastGeneratedAt", "userId", "createdAt", "updatedAt" FROM "recurring_expenses"`);
        await queryRunner.query(`DROP TABLE "recurring_expenses"`);
        await queryRunner.query(`ALTER TABLE "temporary_recurring_expenses" RENAME TO "recurring_expenses"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recurring_expenses" RENAME TO "temporary_recurring_expenses"`);
        await queryRunner.query(`CREATE TABLE "recurring_expenses" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar(255) NOT NULL, "amount" decimal(14,2) NOT NULL, "startDate" date NOT NULL, "endDate" date, "frequency" text NOT NULL, "customIntervalDays" integer, "totalInstallments" integer NOT NULL DEFAULT (0), "currentInstallment" integer NOT NULL DEFAULT (0), "type" text NOT NULL, "lastGeneratedAt" datetime, "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "recurring_expenses"("id", "description", "amount", "startDate", "endDate", "frequency", "customIntervalDays", "totalInstallments", "currentInstallment", "type", "lastGeneratedAt", "userId", "createdAt", "updatedAt") SELECT "id", "description", "amount", "startDate", "endDate", "frequency", "customIntervalDays", "totalInstallments", "currentInstallment", "type", "lastGeneratedAt", "userId", "createdAt", "updatedAt" FROM "temporary_recurring_expenses"`);
        await queryRunner.query(`DROP TABLE "temporary_recurring_expenses"`);
        await queryRunner.query(`DROP TABLE "recurring_expenses"`);
    }

}
