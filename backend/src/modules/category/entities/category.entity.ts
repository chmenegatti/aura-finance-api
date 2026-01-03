import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum CategoryType {
  INCOMING = "INCOMING",
  OUTCOMING = "OUTCOMING",
}

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 120 })
  name!: string;

  @Column({ length: 80 })
  icon!: string;

  @Column({ length: 20 })
  color!: string;

  @Column({ type: "text" })
  type!: CategoryType;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
