import { Request, Response } from "express";
import { AppDataSource } from "../config/OrmConfig";
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { CartItem } from "../models/CartItem";
import { User } from "../models/User";
import { UserPokemon } from "../models/UserPokemon";

const orderRepository = AppDataSource.getRepository(Order);
const orderItemRepository = AppDataSource.getRepository(OrderItem);
const cartRepository = AppDataSource.getRepository(CartItem);
const userRepository = AppDataSource.getRepository(User);
const userPokemonRepository = AppDataSource.getRepository(UserPokemon);

export class OrderController {
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;

      // Obtener el usuario y su carrito
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      const cartItems = await cartRepository.find({
        where: { user: { id: userId } },
        relations: ["pokemon"],
      });

      if (cartItems.length === 0) {
        res.status(400).json({ message: "El carrito está vacío" });
        return;
      }

      // Calcular el total de la compra
      let totalPrice = 0;
      cartItems.forEach((item) => {
        let price = item.pokemon.price;
        if (item.isShiny) {
          price *= 1.5; 
        }
        totalPrice += price * item.quantity;
      });

      // Verificar si el usuario tiene suficiente saldo
      if (user.balance < totalPrice) {
        res.status(400).json({ message: "Saldo insuficiente" });
        return;
      }

      // Crear la orden
      const newOrder = orderRepository.create({
        user,
        total_price: totalPrice,
        status: "completed",
      });

      await orderRepository.save(newOrder);

      // Mover los Pokémon del carrito a la orden y a la caja del usuario
      for (const item of cartItems) {
        // Crear un registro en `order_items`
        const orderItem = orderItemRepository.create({
          order: newOrder,
          pokemon: item.pokemon,
          quantity: item.quantity,
          subtotal: item.pokemon.price * item.quantity,
          isShiny: item.isShiny,
        });

        await orderItemRepository.save(orderItem);

        // Mover Pokémon a `user_pokemons`
        for (let i = 0; i < item.quantity; i++) {
          const userPokemon = userPokemonRepository.create({
            user,
            pokemon: item.pokemon,
            isShiny: item.isShiny,
          });
          await userPokemonRepository.save(userPokemon);
        }
      }

      // Restar saldo al usuario
      user.balance -= totalPrice;
      await userRepository.save(user);

      // Vaciar el carrito
      await cartRepository.remove(cartItems);

      res.status(201).json({
        message: "Compra realizada con éxito",
        order: newOrder,
      });
    } catch (error) {
      res.status(500).json({ message: "Error al procesar la orden", error });
    }
  }

  static async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;

      const orders = await orderRepository.find({
        where: { user: { id: userId } },
        relations: ["orderItems", "orderItems.pokemon"],
      });

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las órdenes", error });
    }
  }
}
