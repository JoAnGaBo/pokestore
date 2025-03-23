import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
  user!: User;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total_price!: number;

  @Column({ default: "completed" })
  status!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems!: OrderItem[];
}
