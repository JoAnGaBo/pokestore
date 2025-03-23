'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Importar Link de Next.js para el enrutamiento

const Sidebar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null); // Estado para almacenar los datos del usuario

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
      setUser(JSON.parse(user)); // Parsear el JSON del usuario
    }
  }, []);

  const handleLogout = () => {
    // Eliminar el token y los datos del usuario
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="w-full bg-gray-900 text-white p-4 flex items-center justify-between">
      {/* Mostrar el nombre de usuario si está autenticado */}
      {isAuthenticated ? (
        <div className="flex flex-col items-center space-y-4"> {/* Se añadió más espacio entre los elementos */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded-full hover:bg-opacity-80"
          >
            Cerrar sesión
          </button>
        </div>

      ) : (
        <Link href="/login">
          <button
            className="px-4 py-2 rounded-full bg-red-600 hover:bg-opacity-80"
          >
            Iniciar sesión
          </button>
        </Link>
      )}

{isAuthenticated ? (
        <div className="flex flex-col items-center space-y-4"> {/* Se añadió más espacio entre los elementos */}
          <p className="text-white">Usuario: {user?.username}</p> {/* Mostrar nombre de usuario */}
          
        </div>

      ) : (
        <p className="text-white">Por favor inicia sesion.</p>
      )}

      

      {/* Botones de navegación */}
      {isAuthenticated && (
        <div className="space-x-4">
          <Link href="../box">
            <button className="px-4 py-2 bg-red-600 rounded hover:bg-opacity-80">
              Caja de Pokémon
            </button>
          </Link>
          <Link href="../cart">
            <button className="px-4 py-2 bg-red-600 rounded hover:bg-opacity-80">
              Carrito
            </button>
          </Link>
          <Link href="/order">
            <button className="px-4 py-2 bg-red-600 rounded hover:bg-opacity-80">
              Órdenes
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
