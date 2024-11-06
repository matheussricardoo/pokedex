'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function CompareMode({ pokemon1, pokemon2 }) {
  const [selectedPokemon2, setSelectedPokemon2] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchPokemon = async (term) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${term.toLowerCase()}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults([data]);
      }
    } catch (error) {
      console.error('Erro ao buscar pokemon:', error);
    }
  };

  const formatStatName = (statName) => {
    const statTranslations = {
      'hp': 'HP',
      'attack': 'ATTACK',
      'defense': 'DEFENSE',
      'special-attack': 'SP. ATTACK',
      'special-defense': 'SP. DEFENSE',
      'speed': 'SPEED'
    };
    return statTranslations[statName] || statName.toUpperCase();
  };

  const StatBar = ({ value, maxValue = 255, label }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-[#0f380f] mb-1">
        <span>{formatStatName(label)}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 bg-[#0f380f]">
        <div
          className="h-full bg-[#98cb98] transition-all duration-500"
          style={{ width: `${(value / maxValue) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Área de busca */}
      {!selectedPokemon2 && (
        <div className="bg-[#98cb98] border-2 border-[#0f380f] p-4">
          <input
            type="text"
            placeholder="Buscar Pokémon para comparar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              searchPokemon(e.target.value);
            }}
            className="w-full px-4 py-2 bg-[#306230] text-[#98cb98] border-2 border-[#0f380f]
                     placeholder-[#98cb98]/70 focus:outline-none uppercase"
          />
          
          {searchResults.length > 0 && (
            <div className="mt-2 space-y-2">
              {searchResults.map(pokemon => (
                <button
                  key={pokemon.id}
                  onClick={() => setSelectedPokemon2(pokemon)}
                  className="w-full p-2 bg-[#306230] text-[#98cb98] border-2 border-[#0f380f]
                           hover:bg-[#0f380f] transition-colors uppercase"
                >
                  {pokemon.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Comparação */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#98cb98] border-2 border-[#0f380f] p-4">
          <div className="aspect-square relative mb-4">
            <Image
              src={pokemon1.sprites.other['official-artwork'].front_default}
              alt={pokemon1.name}
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-lg text-[#0f380f] uppercase mb-4">{pokemon1.name}</h3>
          {pokemon1.stats.map(stat => (
            <StatBar
              key={stat.stat.name}
              value={stat.base_stat}
              label={stat.stat.name}
            />
          ))}
        </div>

        {selectedPokemon2 ? (
          <div className="bg-[#98cb98] border-2 border-[#0f380f] p-4">
            <div className="aspect-square relative mb-4">
              <Image
                src={selectedPokemon2.sprites.other['official-artwork'].front_default}
                alt={selectedPokemon2.name}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-lg text-[#0f380f] uppercase mb-4">{selectedPokemon2.name}</h3>
            {selectedPokemon2.stats.map(stat => (
              <StatBar
                key={stat.stat.name}
                value={stat.base_stat}
                label={stat.stat.name}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#98cb98] border-2 border-[#0f380f] p-4 flex items-center justify-center">
            <p className="text-[#0f380f] text-center uppercase">
              Busque um Pokémon para comparar
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 