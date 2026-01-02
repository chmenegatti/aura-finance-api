import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "./user.entity.js";

export enum RecurringFrequency {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
  CUSTOM = "CUSTOM",
}

export enum RecurringExpenseType {
  FINANCING = "FINANCING",
  LOAN = "LOAN",
  SUBSCRIPTION = "SUBSCRIPTION",
  OTHER = "OTHER",
}

@Entity("recurring_expenses")
export class RecurringExpense {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 255 })
  description!: string;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  amount!: string;

  @Column({ type: "date" })
  startDate!: Date;

  @Column({ type: "date", nullable: true })
  endDate?: Date;

  @Column({ type: "text" })
  frequency!: RecurringFrequency;

  @Column({ type: "int", nullable: true })
  customIntervalDays?: number;

  @Column({ type: "int", default: 0 })
  totalInstallments!: number;

  @Column({ type: "int", default: 0 })
  currentInstallment!: number;

  @Column({ type: "text" })
  type!: RecurringExpenseType;

  @Column({ type: "datetime", nullable: true })
  lastGeneratedAt?: Date;

  @Column()
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
