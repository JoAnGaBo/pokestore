import { Router } from "express";
import { PokemonController } from "../controllers/PokemonController";

const router = Router();

router.post("/add", (req, res) => PokemonController.addPokemon(req, res));
router.get("/", (req, res) => PokemonController.getAllPokemons(req, res));


export default router;
