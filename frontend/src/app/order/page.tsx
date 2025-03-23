'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:4000/api/orders/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            setOrders(data); // Guardar las órdenes en el estado
          } else {
            setError('Error al obtener las órdenes.');
          }
        } catch (err) {
          setError('Error al conectar con el servidor');
        }
      }
    };

    fetchOrders();
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
        <h1 className="text-5xl font-bold text-center mb-6">Órdenes</h1>

        {/* Mostrar las órdenes */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-800 p-6 rounded-lg mb-4">
              <h2 className="text-2xl font-semibold mb-4">
                Orden ID: {order.id} - Total: ${order.total_price} - Estado: {order.status}
              </h2>

              <p className="text-sm text-gray-400">Fecha: {formatDate(order.created_at)}</p>

              {/* Mostrar los detalles de los productos en la orden */}
              <div className="mt-4 space-y-4">
                {order.orderItems.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={
                        item.isShiny
                          ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${item.pokemon.pokemon_id}.png`
                          : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.pokemon.pokemon_id}.png`
                      }
                      alt={item.pokemon.name}
                      className="w-24 h-24 object-contain"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{item.pokemon.name}</h3>
                      <p>Cantidad: {item.quantity}</p>
                      <p>Precio: ${item.subtotal}</p>
                      <p className="text-sm text-gray-400">
                        {item.isShiny ? 'Shiny: Sí' : 'Shiny: No'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
