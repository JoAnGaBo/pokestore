import { Request, Response } from "express";
import { AppDataSource } from "../config/OrmConfig";
import { Pokemon } from "../models/Pokemon";
import { PokeApiService } from "../services/PokeApiService";

const pokemonRepository = AppDataSource.getRepository(Pokemon);

export class PokemonController {
  static async addPokemon(req: Request, res: Response): Promise<void> {
    try {
      const { pokemonId } = req.body;

      const pokemonData = await PokeApiService.getPokemonData(pokemonId);
      if (!pokemonData) {
        res.status(404).json({ message: "Pokémon no encontrado en la PokéAPI" });
        return;
      }

      let pokemon = await pokemonRepository.findOne({ where: { pokemon_id: pokemonId } });

      if (!pokemon) {
        pokemon = pokemonRepository.create({
          pokemon_id: pokemonData.id,
          name: pokemonData.name,
          price: pokemonData.price,
        });
        await pokemonRepository.save(pokemon);
      }

      res.status(201).json({ message: "Pokémon agregado correctamente", pokemon });
    } catch (error) {
      res.status(500).json({ message: "Error al agregar Pokémon", error });
    }
  }

  static async getAllPokemons(req: Request, res: Response): Promise<void> {
    try {
      const pokemons = await pokemonRepository.find();
      res.status(200).json(pokemons);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los Pokémon", error });
    }
  }
}
