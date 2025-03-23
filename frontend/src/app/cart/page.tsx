'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';

const CartPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]); // Para almacenar los elementos del carrito
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar si el usuario está autenticado
  const [loading, setLoading] = useState<boolean>(true); // Para indicar que estamos cargando las imágenes
  const [error, setError] = useState<string>(''); // Para manejar errores
  const router = useRouter();

  useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      try {
        const response = await fetch('http://localhost:4000/api/cart/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          // Ahora obtenemos las imágenes de la PokéAPI para cada Pokémon
          const updatedCartItems = await Promise.all(data.map(async (item: any) => {
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${item.pokemon.name}`);
            const pokemonData = await pokemonResponse.json();

            // Asociar los sprites del Pokémon al item del carrito
            return {
              ...item,
              pokemon: {
                ...item.pokemon,
                sprites: pokemonData.sprites,
                price: item.pokemon.price, // Asegúrate de que el precio se asigna correctamente
              },
            };
          }));

          setCartItems(updatedCartItems); // Establecer los elementos con las imágenes de Pokémon
          setLoading(false);
        } else {
          console.error('Error al obtener los datos del carrito:', data);
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    };

    fetchCartData();
  }, []);

  const handleRemoveFromCart = async (cartItemId: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:4000/api/cart/remove/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Actualizar el carrito después de eliminar el elemento
        setCartItems(cartItems.filter(item => item.id !== cartItemId));
      } else {
        alert('Hubo un error al eliminar del carrito');
      }
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:4000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartItems: cartItems.map(item => ({
            pokemonId: item.pokemon.id,
            quantity: item.quantity,
            isShiny: item.isShiny,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Compra realizada con éxito!');
        // Limpiar carrito después de la compra
        setCartItems([]);
        // Recargar la página para reflejar el carrito vacío
        router.refresh();
      } else {
        alert('Hubo un error en la compra: ' + data.message);
      }
    } catch (error) {
      console.error('Error al realizar la compra:', error);
    }
  };

  const handleGoHome = () => {
    router.push('/'); // Redirige a la página principal
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center text-white">
        <p>Necesitas iniciar sesión para ver tu carrito.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center text-white">
        <p>Cargando carrito...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray text-white">
      <Sidebar />
      <div className="flex flex-col items-center justify-center p-6 mt-24 space-y-4">
        <h1 className="text-4xl font-bold mb-6">Carrito</h1>

        {cartItems.length === 0 ? (
          <p className="text-white text-center">Tu carrito está vacío.</p>
        ) : (
          cartItems.map((cartItem) => (
            <div key={cartItem.id} className="flex items-center justify-between w-full bg-gray-800 p-4 mb-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={cartItem.isShiny ? cartItem.pokemon.sprites.front_shiny : cartItem.pokemon.sprites.front_default}
                  alt={cartItem.pokemon.name}
                  className="w-24 h-24 object-contain"
                />
                <div className="text-left">
                  <h2 className="text-2xl font-semibold">{cartItem.pokemon.name}</h2>
                  <p>Cantidad: {cartItem.quantity}</p>
                  <p>Shiny: {cartItem.isShiny ? 'Sí' : 'No'}</p>
                  <p>Precio: ${cartItem.pokemon.price}</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleRemoveFromCart(cartItem.id)}
                  className="px-4 py-2 bg-red-600 rounded-full hover:bg-opacity-80"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleGoHome}
            className="px-6 py-2 bg-gray-600 rounded-full hover:bg-opacity-80"
          >
            Regresar a la página principal
          </button>

          <button
            onClick={handleCheckout}
            className="px-6 py-2 bg-green-600 rounded-full hover:bg-opacity-80"
          >
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;