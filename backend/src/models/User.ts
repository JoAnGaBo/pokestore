import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Order } from "./Order";
import { CartItem } from "./CartItem";
import { UserPokemon } from "./UserPokemon";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 1000.00 })
  balance!: number;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems!: CartItem[];

  @OneToMany(() => UserPokemon, (userPokemon) => userPokemon.user)
  userPokemons!: UserPokemon[];
}
