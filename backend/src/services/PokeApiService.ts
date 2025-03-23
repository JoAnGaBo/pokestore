import axios from "axios";

export class PokeApiService {
  static async getPokemonData(pokemonId: number) {
    try {
      const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);

      const baseExperience = pokemonResponse.data.base_experience;
      const stats = pokemonResponse.data.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0);
      const isLegendary = speciesResponse.data.is_legendary;
      const isMythical = speciesResponse.data.is_mythical;
      const flavorTextEntries = speciesResponse.data.flavor_text_entries;

      // Verificar si tiene sprite shiny
      const hasShinySprite = pokemonResponse.data.sprites.front_shiny !== null;

      // Identificar Ultraentes
      const isUltraBeast = flavorTextEntries.some((entry: any) =>
        entry.language.name === "es" &&
        (entry.flavor_text.includes("ultraumbral") || entry.flavor_text.includes("Ultraente"))
      );

      // Identificar Pseudolegendarios (stats total = 600 y no es legendario/mítico)
      const isPseudoLegendary = stats === 600 && !isLegendary && !isMythical;

      // Identificar Paradox Pokémon (buscamos palabras clave en la descripción)
      const isParadox = flavorTextEntries.some((entry: any) =>
        entry.language.name === "es" &&
        (entry.flavor_text.includes("texto antiguo") || entry.flavor_text.includes("Pokémon paradoja"))
      );

      // Aplicar multiplicadores
      let multiplier = 1;
      if (isLegendary) multiplier *= 2.5;
      if (isMythical) multiplier *= 3;
      if (isUltraBeast) multiplier *= 2.2;
      if (isPseudoLegendary) multiplier *= 1.8;
      if (isParadox) multiplier *= 2;
      if (hasShinySprite) multiplier *= 1.5;

      // Calcular precio final
      const price = Math.floor((baseExperience + stats) * multiplier);

      return {
        id: pokemonId,
        name: pokemonResponse.data.name,
        price,
        isLegendary,
        isMythical,
        isUltraBeast,
        isPseudoLegendary,
        isParadox,
        hasShinySprite,
      };
    } catch (error) {
      console.error("Error al obtener datos de la PokéAPI:", error);
      return null;
    }
  }
}
