'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Pokemon {
  name: string;
  url: string;
}

const PokemonList = ({ pokemons }: { pokemons: Pokemon[] }) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>(pokemons);
  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0); // Para controlar la página actual
  const router = useRouter(); // Usamos router para redirigir al usuario a la página del Pokémon

  // Cargar Pokémon desde la API de PokéAPI
  useEffect(() => {
    const loadPokemons = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
      const data = await response.json();
      setPokemonList(data.results);
    };

    loadPokemons();
  }, [offset]); // El useEffect se ejecutará cada vez que cambie el offset

  // Función para buscar el Pokémon
  const handleSearch = async () => {
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      try {
        // Verifica si el término es un número (ID de Pokémon)
        let response;
        if (!isNaN(Number(lowerSearchTerm))) {
          response = await fetch(`https://pokeapi.co/api/v2/pokemon/${lowerSearchTerm}`);
        } else {
          response = await fetch(`https://pokeapi.co/api/v2/pokemon/${lowerSearchTerm}`);
        }
        if (response.ok) {
          const data = await response.json();
          // Redirigir al detalle del Pokémon
          router.push(`/pokemon/${data.name}`);
        } else {
          alert('No se encontró el Pokémon');
        }
      } catch (error) {
        console.error('Error al buscar Pokémon:', error);
        alert('Error al realizar la búsqueda');
      }
    }
  };

  return (
    <div className="flex flex-wrap justify-start p-4">
      {/* Campo de búsqueda con el botón de búsqueda */}
      <div className="w-full mb-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          className="p-2 bg-gray-800 text-white rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-opacity-80"
        >
          Buscar
        </button>
      </div>

      {/* Mapeo de Pokémon */}
      {pokemonList.map((pokemon, index) => {
        // Obtén el ID del pokemon desde la URL
        const pokemonId = pokemon.url.split('/')[6];

        return (
          <div key={pokemon.name} className="w-1/4 p-2">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <Link href={`/pokemon/${pokemon.name}`}>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                  alt={pokemon.name}
                  className="w-full h-33 object-cover rounded mb-2 cursor-pointer"
                />
                <h3 className="text-xl text-white">{pokemon.name}</h3>
              </Link>
            </div>
          </div>
        );
      })}

      {/* Botones de paginación */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => setOffset(offset - 20)}
          disabled={offset <= 0}
          className="px-4 py-2 bg-red-600 rounded hover:bg-opacity-80 disabled:bg-gray-600"
        >
          Atrás
        </button>
        <button
          onClick={() => setOffset(offset + 20)}
          className="px-4 py-2 bg-red-600 rounded hover:bg-opacity-80"
        >
          Adelante
        </button>
      </div>
    </div>
  );
};

export default PokemonList;
