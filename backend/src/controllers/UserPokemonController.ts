import { Request, Response } from "express";
import { AppDataSource } from "../config/OrmConfig";
import { UserPokemon } from "../models/UserPokemon";
import { User } from "../models/User";
import { Pokemon } from "../models/Pokemon";

const userPokemonRepository = AppDataSource.getRepository(UserPokemon);
const userRepository = AppDataSource.getRepository(User);
const pokemonRepository = AppDataSource.getRepository(Pokemon);

export class UserPokemonController {
  static async getUserPokemons(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;

      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      const userPokemons = await userPokemonRepository.find({ where: { user: { id: userId } }, relations: ["pokemon"] });

      res.status(200).json(userPokemons);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los Pokémon del usuario", error });
    }
  }

  static async createUserPokemon(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { pokemonId, isShiny } = req.body;

      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      const pokemon = await pokemonRepository.findOne({ where: { pokemon_id: pokemonId } });
      if (!pokemon) {
        res.status(404).json({ message: "Pokémon no encontrado" });
        return;
      }

      const userPokemon = userPokemonRepository.create({
        user,
        pokemon,
        isShiny: isShiny || false,
        ability: 1,
        movement1: 0,
        movement2: 1,
        movement3: 2,
        movement4: 3,
      });

      await userPokemonRepository.save(userPokemon);
      res.status(201).json({ message: "Pokémon agregado a la caja del usuario", userPokemon });
    } catch (error) {
      res.status(500).json({ message: "Error al agregar Pokémon a la caja del usuario", error });
    }
  }

  static async updateUserPokemon(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { pokemonId } = req.params;
      const { isShiny, ability, movement1, movement2, movement3, movement4 } = req.body;

      const userPokemon = await userPokemonRepository.findOne({ where: { user: { id: userId }, pokemon: { pokemon_id: parseInt(pokemonId) } } });

      if (!userPokemon) {
        res.status(404).json({ message: "El Pokémon no está en la caja del usuario" });
        return;
      }

      userPokemon.isShiny = isShiny !== undefined ? isShiny : userPokemon.isShiny;
      userPokemon.ability = ability !== undefined ? ability : userPokemon.ability;
      userPokemon.movement1 = movement1 !== undefined ? movement1 : userPokemon.movement1;
      userPokemon.movement2 = movement2 !== undefined ? movement2 : userPokemon.movement2;
      userPokemon.movement3 = movement3 !== undefined ? movement3 : userPokemon.movement3;
      userPokemon.movement4 = movement4 !== undefined ? movement4 : userPokemon.movement4;

      await userPokemonRepository.save(userPokemon);
      res.status(200).json({ message: "Pokémon actualizado en la caja del usuario", userPokemon });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el Pokémon del usuario", error });
    }
  }

  static async deleteUserPokemon(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { pokemonId } = req.params;

      const userPokemon = await userPokemonRepository.findOne({ where: { user: { id: userId }, pokemon: { pokemon_id: parseInt(pokemonId) } } });

      if (!userPokemon) {
        res.status(404).json({ message: "El Pokémon no está en la caja del usuario" });
        return;
      }

      await userPokemonRepository.remove(userPokemon);
      res.status(200).json({ message: "Pokémon eliminado de la caja del usuario" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el Pokémon del usuario", error });
    }
  }
}