import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import type { CreditCardExpense } from "./credit-card-expense.entity.js";
import { User } from "../../users/entities/user.entity.js";

@Entity("credit_cards")
export class CreditCard {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User)
  user!: User;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  brand!: string;

  @Column({ length: 4 })
  lastFourDigits!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  creditLimit!: string;

  @Column({ type: "int" })
  closingDay!: number;

  @Column({ type: "int" })
  dueDay!: number;

  @OneToMany("CreditCardExpense", "creditCard")
  expenses?: CreditCardExpense[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
