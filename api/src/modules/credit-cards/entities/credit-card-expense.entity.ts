import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import type { CreditCard } from "./credit-card.entity.js";
import { User } from "../../users/entities/user.entity.js";

@Entity("credit_card_expenses")
export class CreditCardExpense {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  creditCardId!: string;

  @ManyToOne("CreditCard", "expenses")
  @JoinColumn({ name: "creditCardId" })
  creditCard!: CreditCard;

  @Column()
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ length: 36 })
  groupId!: string;

  @Column({ length: 255 })
  description!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  amount!: string;

  @Column({ type: "date" })
  purchaseDate!: Date;

  @Column({ type: "int", default: 1 })
  installments!: number;

  @Column({ type: "int", default: 1 })
  currentInstallment!: number;

  @Column({ length: 7 })
  invoiceMonth!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
