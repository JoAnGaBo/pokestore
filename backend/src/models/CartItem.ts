import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { User } from "./User";
import { Pokemon } from "./Pokemon";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.cartItems, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.cartItems, { onDelete: "CASCADE" })
  pokemon!: Pokemon;

  @Column({ default: 1 })
  quantity!: number;

  @Column({ default: false })
  isShiny!: boolean;
}