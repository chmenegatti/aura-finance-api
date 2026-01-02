import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Category } from "./category.entity.js";
import { User } from "./user.entity.js";

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 255 })
  description!: string;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  amount!: string;

  @Column({ type: "text" })
  type!: TransactionType;

  @Column({ type: "datetime" })
  date!: Date;

  @Column()
  paymentMethod!: string;

  @Column({ default: false })
  isRecurring!: boolean;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ type: "text", nullable: true })
  receiptUrl?: string;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: "categoryId" })
  category!: Category;

  @Column()
  categoryId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
