import { Router } from "express";
import userPokemonRoutes from "./UserPokemonRoutes";
import cartRoutes from "./CartRoutes";
import orderRoutes from "./OrderRoutes";
import pokemonRoutes from "./PokemonRoutes";
import userRoutes from "./UserRoutes";

const router = Router();

router.use("/user-pokemons", userPokemonRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/pokemons", pokemonRoutes);
router.use("/users", userRoutes);

export default router;