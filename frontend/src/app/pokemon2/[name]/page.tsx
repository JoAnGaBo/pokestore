'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar';

const PokemonDetail = () => {
  const { name } = useParams(); // Capturamos el nombre del Pokémon desde la URL
  const [pokemon, setPokemon] = useState<any>(null);
  const [abilityOptions, setAbilityOptions] = useState<any[]>([]); // Habilidades
  const [moveOptions, setMoveOptions] = useState<any[]>([]); // Movimientos
  const [selectedAbility, setSelectedAbility] = useState(''); // Habilidad seleccionada
  const [selectedMoves, setSelectedMoves] = useState<string[]>([]); // Movimientos seleccionados
  const [isShiny, setIsShiny] = useState(false); // Estado para shiny
  const router = useRouter(); // Usar el hook useRouter

  useEffect(() => {
    const fetchPokemonData = async () => {
      if (name) {
        // Obtener los detalles del Pokémon desde la PokeAPI
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        setPokemon(data);

        // Obtener las habilidades
        const abilities = data.abilities.map((ability: any) => ability.ability.name);
        setAbilityOptions(abilities);

        // Obtener los movimientos completos (no solo de la base de datos)
        const allMoves = data.moves.map((move: any) => move.move.name);
        setMoveOptions(allMoves);

        // Comprobar si el Pokémon es shiny
        const query = new URLSearchParams(window.location.search);
        const shiny = query.get('isShiny') === 'true'; // Convertimos a booleano
        setIsShiny(shiny);
      }
    };

    fetchPokemonData();
  }, [name]); // Este efecto se ejecutará cuando cambie el nombre del Pokémon

  if (!pokemon) return <div className="text-white text-center mt-4">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar />
      {/* Contenedor principal de detalles del Pokémon */}
      <button
        onClick={() => router.push('/../../box')}
        className="mt-6 px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-500"
      >
        Regresar a la página principal
      </button>
      <div className="flex flex-col items-center justify-center p-6 mt-24">
        <h1 className="text-5xl font-bold text-center mb-6">{pokemon.name}</h1>

        {/* Imagen del Pokémon */}
        <img
          src={isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default} // Usamos el estado isShiny
          alt={pokemon.name}
          className="w-56 h-56 object-contain rounded-lg shadow-lg mb-6 md:mb-0"
        />

        {/* Estadísticas */}
        <div className="space-y-4 mt-4">
          <h2 className="text-3xl font-semibold mb-4">Estadísticas</h2>
          <ul className="space-y-2">
            {pokemon.stats.map((stat: any) => (
              <li key={stat.stat.name} className="flex justify-between text-lg">
                <span className="font-medium">{stat.stat.name}:</span>
                <span>{stat.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Habilidad */}
        <div className="mt-4">
          <h2 className="text-3xl font-semibold mb-4">Habilidad</h2>
          <select
            value={selectedAbility}
            onChange={(e) => setSelectedAbility(e.target.value)}
            className="p-2 bg-gray-800 text-white rounded"
          >
            <option value="">Seleccionar habilidad</option>
            {abilityOptions.map((ability, index) => (
              <option key={index} value={ability}>
                {ability}
              </option>
            ))}
          </select>
        </div>

        {/* Movimientos */}
        <div className="mt-4 space-y-2">
          <h2 className="text-3xl font-semibold mb-4">Movimientos</h2>
          {Array.from({ length: 4 }).map((_, index) => (
            <select
              key={index}
              value={selectedMoves[index] || ''}
              onChange={(e) => {
                const newMoves = [...selectedMoves];
                newMoves[index] = e.target.value;
                setSelectedMoves(newMoves);
              }}
              className="p-2 bg-gray-800 text-white rounded mb-2"
            >
              <option value="">Seleccionar movimiento</option>
              {moveOptions.map((moveOption, i) => (
                <option key={i} value={moveOption}>
                  {moveOption}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
