import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCreditCards1767322000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "credit_cards",
        columns: [
          { name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid" },
          { name: "userId", type: "uuid" },
          { name: "name", type: "varchar", length: "255" },
          { name: "brand", type: "varchar", length: "255" },
          { name: "lastFourDigits", type: "varchar", length: "4" },
          { name: "creditLimit", type: "decimal", precision: 12, scale: 2 },
          { name: "closingDay", type: "int" },
          { name: "dueDay", type: "int" },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("credit_cards");
  }
}
