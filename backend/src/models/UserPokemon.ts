import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { User } from "./User";
import { Pokemon } from "./Pokemon";

@Entity()
export class UserPokemon {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.userPokemons, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.userPokemons, { onDelete: "CASCADE" })
  pokemon!: Pokemon;

  @Column({ default: false })
  isShiny!: boolean;

  @Column({ default: 1 })
  ability!: number;

  @Column({ default: 0 })
  movement1!: number;

  @Column({ default: 1 })
  movement2!: number;

  @Column({ default: 2 })
  movement3!: number;

  @Column({ default: 3 })
  movement4!: number;
}