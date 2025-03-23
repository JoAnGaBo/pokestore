import { Router } from "express";
import { UserPokemonController } from "../controllers/UserPokemonController";

const router = Router();

// Rutas para UserPokemon
router.get("/", UserPokemonController.getUserPokemons);
router.post("/", UserPokemonController.createUserPokemon);
router.put("/:pokemonId", UserPokemonController.updateUserPokemon);
router.delete("/:pokemonId", UserPokemonController.deleteUserPokemon);

export default router;