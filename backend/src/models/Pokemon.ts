import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { CartItem } from "./CartItem";
import { OrderItem } from "./OrderItem";
import { UserPokemon } from "./UserPokemon";

@Entity("pokemons")
export class Pokemon {
  @PrimaryColumn()
  pokemon_id!: number; 

  @Column()
  name!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => CartItem, (cartItem) => cartItem.pokemon)
  cartItems!: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.pokemon)
  orderItems!: OrderItem[];

  @OneToMany(() => UserPokemon, (userPokemon) => userPokemon.pokemon)
  userPokemons!: UserPokemon[];
}