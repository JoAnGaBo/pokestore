import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Order } from "./Order";
import { Pokemon } from "./Pokemon";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: "CASCADE" })
  order!: Order;

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.orderItems, { onDelete: "CASCADE" })
  pokemon!: Pokemon;

  @Column({ default: 1 })
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  subtotal!: number;

  @Column({ default: false })
  isShiny!: boolean; 
}