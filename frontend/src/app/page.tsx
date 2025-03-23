'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import PokemonList from '../../components/PokemonList';
import Footer from '../../components/Footer';

const Home = () => {
  const [pokemons, setPokemons] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
      .then(res => res.json())
      .then(data => setPokemons(data.results));
  }, []);

  return (
    <div className="parent bg-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 p-4">
        <PokemonList pokemons={pokemons} />
      </div>

      {/* Barra inferior */}
      <Footer />
    </div>
  );
};

export default Home;
