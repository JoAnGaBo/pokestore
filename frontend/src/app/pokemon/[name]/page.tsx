'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar';

const PokemonDetail = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState<any>(null);
  const [price, setPrice] = useState<number>(0);
  const [isShiny, setIsShiny] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar si el usuario está autenticado
  const [error, setError] = useState<string>(''); // Error general para mostrar
  const router = useRouter();

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        if (name) {
          // Obtener datos del Pokémon de la PokeAPI
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          if (!response.ok) {
            throw new Error('No se pudo obtener el Pokémon');
          }
          const data = await response.json();
          setPokemon(data);
          console.log(data.id);

          // Enviar el Pokémon a la API para obtener el precio
          const postResponse = await fetch('http://localhost:4000/api/pokemons/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pokemonId: data.id }),
          });

          const postData = await postResponse.json();

          if (postResponse.ok) {
            setPrice(postData.pokemon.price);
          } else {
            throw new Error('Error al obtener el precio del Pokémon');
          }
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchPokemonData();

    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, [name]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Si no está autenticado, mostrar mensaje de error y redirigir a la página de registro
      setError('Necesitas estar registrado para agregar al carrito. Por favor, regístrate.');
      setTimeout(() => {
        router.push('../../login'); // Redirige a la página de registro
      }, 2000);
      return;
    }
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:4000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pokemonId: pokemon.id,
          quantity: quantity,
          isShiny: isShiny,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Pokémon agregado al carrito!');
      } else {
        alert('Hubo un error al agregar al carrito');
      }
    } catch (error: any) {
      setError('Error al conectar con el servidor del carrito');
    }
  };

  if (!pokemon) return <div className="text-white text-center mt-4">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray text-white">
      <Sidebar />
      <div className="flex flex-col items-center justify-center p-6 mt-24">
        {/* Botón de regresar */}
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 rounded-full mb-6 hover:bg-blue-500"
        >
          Regresar a la página principal
        </button>

        <h1 className="text-5xl font-bold text-center mb-6">{pokemon.name}</h1>

        <div className="flex flex-col items-center justify-center md:flex-row md:space-x-10">
          <img
            src={isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-56 h-56 object-contain rounded-lg shadow-lg mb-6 md:mb-0"
          />
          <div className="space-y-4">
            {/* Estadísticas del Pokémon */}
            <div>
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

            {/* Tipo de Pokémon */}
            <div className="mt-4">
              <h2 className="text-3xl font-semibold mb-4">Tipo</h2>
              <div className="flex space-x-3">
                {pokemon.types.map((type: any) => (
                  <span key={type.type.name} className="px-4 py-2 bg-blue-600 rounded-full text-white font-medium">
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Precio */}
            <div className="mt-4">
              <p className="text-xl font-semibold">Precio: ${price} c/u</p>
            </div>

            {/* Selección de Shiny */}
            <div className="mt-4 flex items-center">
              <label htmlFor="shiny" className="mr-4 text-xl">¿Quieres que sea shiny?</label>
              <input
                type="checkbox"
                id="shiny"
                checked={isShiny}
                onChange={() => setIsShiny(!isShiny)}
                className="p-2 bg-gray-800 text-white rounded"
              />
            </div>

            {/* Selección de cantidad */}
            <div className="mt-4">
              <label htmlFor="quantity" className="text-xl">Cantidad</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="p-2 bg-gray-800 text-white rounded mt-2"
              />
            </div>

            {/* Botón de agregar al carrito */}
            <button
              onClick={handleAddToCart}
              className="mt-4 w-full py-2 bg-red-600 text-white rounded hover:bg-red-500"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
