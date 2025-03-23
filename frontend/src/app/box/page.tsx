'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';  // Importamos Link para la navegación

const UserPokemons = () => {
  const [userPokemons, setUserPokemons] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserPokemons = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:4000/api/user-pokemons/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            setUserPokemons(data); // Guardamos los Pokémon del usuario
          } else {
            setError('Error al obtener los Pokémon.');
          }
        } catch (err) {
          setError('Error al conectar con el servidor.');
        }
      }
    };

    fetchUserPokemons();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2); // Obtener los dos últimos dígitos del año

    return `${day}/${month}/${year}`;
  };

  if (error) return <div className="text-white text-center mt-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gray text-white">
      <div className="w-full fixed top-0 left-0 z-10">
        <Sidebar />
      </div>

      <div className="p-6 mt-24">
        <h1 className="text-5xl font-bold text-center">Caja de Pokémon</h1>
        {/* Botón de Regreso */}
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-500 mb-6"
        >
          Regresar a la página principal
        </button>

        {/* Mostrar los Pokémon de la caja */}
        <div className="grid grid-cols-6 gap-4">
          {userPokemons.map((userPokemon) => (
            <Link
              key={userPokemon.id}
              href={`/pokemon2/${userPokemon.pokemon.name}?isShiny=${userPokemon.isShiny}`}  // Pasamos el parámetro isShiny
            >
              <div className="bg-gray-800 p-4 rounded-lg text-center cursor-pointer">
                <div className="flex justify-center mb-2">
                  <img
                    src={
                      userPokemon.isShiny
                        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${userPokemon.pokemon.pokemon_id}.png`
                        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${userPokemon.pokemon.pokemon_id}.png`
                    }
                    alt={userPokemon.pokemon.name}
                    className="w-24 h-24 object-contain mb-2"
                  />
                </div>
                <h2 className="text-xl">{userPokemon.pokemon.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPokemons;
