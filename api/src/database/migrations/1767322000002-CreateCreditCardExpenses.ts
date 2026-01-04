import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateCreditCardExpenses1767322000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "credit_card_expenses",
        columns: [
          { name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid" },
          { name: "creditCardId", type: "uuid" },
          { name: "userId", type: "uuid" },
          { name: "groupId", type: "varchar", length: "36" },
          { name: "description", type: "varchar", length: "255" },
          { name: "amount", type: "decimal", precision: 12, scale: 2 },
          { name: "purchaseDate", type: "date" },
          { name: "installments", type: "int", default: 1 },
          { name: "currentInstallment", type: "int", default: 1 },
          { name: "invoiceMonth", type: "varchar", length: "7" },
          { name: "createdAt", type: "timestamp", default: "now()" },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "credit_card_expenses",
      new TableForeignKey({
        columnNames: ["creditCardId"],
        referencedColumnNames: ["id"],
        referencedTableName: "credit_cards",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "credit_card_expenses",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("credit_card_expenses");

    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey("credit_card_expenses", fk);
      }
    }

    await queryRunner.dropTable("credit_card_expenses");
  }
}
