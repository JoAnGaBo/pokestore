import { Request, Response } from "express";
import { AppDataSource } from "../config/OrmConfig";
import { CartItem } from "../models/CartItem";
import { User } from "../models/User";
import { Pokemon } from "../models/Pokemon";

const cartRepository = AppDataSource.getRepository(CartItem);
const userRepository = AppDataSource.getRepository(User);
const pokemonRepository = AppDataSource.getRepository(Pokemon);

export class CartController {
    static async addToCart(req: Request, res: Response): Promise<void> {
        try {
          const userId = (req as any).userId;
          const { pokemonId, quantity, isShiny } = req.body;
      
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
      
          let cartItem = await cartRepository.findOne({ where: { user: { id: userId }, pokemon: { pokemon_id: pokemonId }, isShiny } });
      
          if (cartItem) {
            cartItem.quantity += quantity || 1;
          } else {
            cartItem = cartRepository.create({ user, pokemon, quantity: quantity || 1, isShiny: isShiny || false });
          }
      
          await cartRepository.save(cartItem);
          res.status(200).json({ message: "Pokémon agregado al carrito", cartItem });
        } catch (error) {
          res.status(500).json({ message: "Error al agregar al carrito", error });
        }
      }
      
  static async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const cartItems = await cartRepository.find({ where: { user: { id: userId } }, relations: ["pokemon"] });

      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el carrito", error });
    }
  }

  static async removeFromCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { pokemonId } = req.params;

      const cartItem = await cartRepository.findOne({ where: { user: { id: userId }, pokemon: { pokemon_id: parseInt(pokemonId) } } });

      if (!cartItem) {
        res.status(404).json({ message: "El Pokémon no está en el carrito" });
        return;
      }

      await cartRepository.remove(cartItem);
      res.status(200).json({ message: "Pokémon eliminado del carrito" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar del carrito", error });
    }
  }
}