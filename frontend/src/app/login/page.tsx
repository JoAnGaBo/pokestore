'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Almacenar el token en el localStorage
        localStorage.setItem('token', data.token);
        
        // Almacenar los datos del usuario (nombre de usuario y correo)
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirigir al usuario a la página principal
        router.push('/');
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg">
        <h2 className="text-3xl text-white text-center mb-4">Iniciar sesión</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white">Correo electrónico</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 mt-2 text-white bg-gray-700 rounded"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-white">Contraseña</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 mt-2 text-white bg-gray-700 rounded"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full py-2 bg-red-600 text-white rounded mt-4 hover:bg-red-500">
            Iniciar sesión
          </button>
        </form>

        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default LoginPage;