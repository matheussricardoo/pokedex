'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CompareMode({ pokemon1 }) {
  const [selectedPokemon2, setSelectedPokemon2] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { t, language } = useLanguage();

  const searchPokemon = async (term) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    try {
      if (!isNaN(term)) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${term}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults([data]);
          return;
        }
      }

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${term.toLowerCase()}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults([data]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Erro ao buscar pokemon:', error);
      setSearchResults([]);
    }
  };

  const getTypeTranslation = (typeName) => {
    const translations = {
      pt: {
        normal: "normal",
        fire: "fogo",
        water: "água",
        electric: "elétrico",
        grass: "planta",
        ice: "gelo",
        fighting: "lutador",
        poison: "veneno",
        ground: "terra",
        flying: "voador",
        psychic: "psíquico",
        bug: "inseto",
        rock: "pedra",
        ghost: "fantasma",
        dragon: "dragão",
        dark: "sombrio",
        steel: "aço",
        fairy: "fada"
      },
      en: {
        normal: "normal",
        fire: "fire",
        water: "water",
        electric: "electric",
        grass: "grass",
        ice: "ice",
        fighting: "fighting",
        poison: "poison",
        ground: "ground",
        flying: "flying",
        psychic: "psychic",
        bug: "bug",
        rock: "rock",
        ghost: "ghost",
        dragon: "dragon",
        dark: "dark",
        steel: "steel",
        fairy: "fairy"
      }
    };

    return translations[language][typeName] || typeName;
  };

  const StatComparison = ({ stat1, stat2, label }) => {
    const difference = stat1 - stat2;
    const maxValue = 255;

    return (
      <div className="mb-4">
        <div className="flex justify-between text-xs text-[#0f380f] mb-1">
          <span className="uppercase">{label}</span>
          <div className="flex gap-2 items-center">
            <span>{stat1}</span>
            {difference !== 0 && (
              <span className={`text-xs ${difference > 0 ? 'text-green-700' : 'text-red-700'}`}>
                ({difference > 0 ? '+' : ''}{difference})
              </span>
            )}
          </div>
        </div>
        <div className="relative h-2 bg-[#0f380f]">
          <div
            className={`h-full transition-all duration-500 ${
              difference >= 0 ? 'bg-[#98cb98]' : 'bg-red-400'
            }`}
            style={{ width: `${(stat1 / maxValue) * 100}%` }}
          />
          {selectedPokemon2 && (
            <div
              className="absolute top-0 h-full w-px bg-white"
              style={{ left: `${(stat2 / maxValue) * 100}%` }}
            />
          )}
        </div>
      </div>
    );
  };

  const getTotalStats = (pokemon) => {
    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  };

  return (
    <div className="space-y-4">
      {/* Área de busca - agora visível mesmo com um Pokémon selecionado */}
      <div className="bg-[#98cb98] border-2 border-[#0f380f] p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[#0f380f] uppercase">
            {selectedPokemon2 ? t('compareWithAnother') : t('searchToCompare')}
          </h3>
          {selectedPokemon2 && (
            <button
              onClick={() => setSelectedPokemon2(null)}
              className="px-4 py-2 bg-[#306230] text-[#98cb98] border-2 border-[#0f380f]
                       hover:bg-[#0f380f] transition-colors uppercase text-sm"
            >
              {t('newComparison')}
            </button>
          )}
        </div>
        <input
          type="text"
          placeholder={t('searchToCompare')}
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
                onClick={() => {
                  setSelectedPokemon2(pokemon);
                  setSearchTerm('');
                  setSearchResults([]);
                }}
                className="w-full p-2 bg-[#306230] text-[#98cb98] border-2 border-[#0f380f]
                         hover:bg-[#0f380f] transition-colors uppercase"
              >
                {pokemon.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comparação */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#98cb98] border-2 border-[#0f380f] p-4 h-full flex flex-col">
          <div className="aspect-square relative mb-4">
            <Image
              src={pokemon1.sprites.other['official-artwork'].front_default}
              alt={pokemon1.name}
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-lg text-[#0f380f] uppercase mb-2">{pokemon1.name}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {pokemon1.types.map(type => (
              <span
                key={type.type.name}
                className={`px-2 py-0.5 text-[10px] text-white uppercase bg-pokemon-${type.type.name}
                         border border-[#0f380f]`}
              >
                {getTypeTranslation(type.type.name)}
              </span>
            ))}
          </div>
          <div className="flex-grow">
            {pokemon1.stats.map(stat => (
              <StatComparison
                key={stat.stat.name}
                stat1={stat.base_stat}
                stat2={selectedPokemon2?.stats.find(s => s.stat.name === stat.stat.name)?.base_stat || 0}
                label={stat.stat.name}
              />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t-2 border-[#0f380f]">
            <div className="flex justify-between text-[#0f380f]">
              <span className="uppercase font-bold">Total</span>
              <div className="flex gap-2 items-center">
                <span className="font-bold">{getTotalStats(pokemon1)}</span>
                {selectedPokemon2 && (
                  <span className={`text-sm ${
                    getTotalStats(pokemon1) > getTotalStats(selectedPokemon2) 
                      ? 'text-green-700' 
                      : getTotalStats(pokemon1) < getTotalStats(selectedPokemon2)
                        ? 'text-red-700'
                        : ''
                  }`}>
                    ({getTotalStats(pokemon1) - getTotalStats(selectedPokemon2) > 0 ? '+' : ''}
                    {getTotalStats(pokemon1) - getTotalStats(selectedPokemon2)})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {selectedPokemon2 ? (
          <div className="bg-[#98cb98] border-2 border-[#0f380f] p-4 h-full flex flex-col">
            <div className="aspect-square relative mb-4">
              <Image
                src={selectedPokemon2.sprites.other['official-artwork'].front_default}
                alt={selectedPokemon2.name}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-lg text-[#0f380f] uppercase mb-2">{selectedPokemon2.name}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedPokemon2.types.map(type => (
                <span
                  key={type.type.name}
                  className={`px-2 py-0.5 text-[10px] text-white uppercase bg-pokemon-${type.type.name}
                           border border-[#0f380f]`}
                >
                  {getTypeTranslation(type.type.name)}
                </span>
              ))}
            </div>
            <div className="flex-grow">
              {selectedPokemon2.stats.map(stat => (
                <StatComparison
                  key={stat.stat.name}
                  stat1={stat.base_stat}
                  stat2={pokemon1.stats.find(s => s.stat.name === stat.stat.name)?.base_stat || 0}
                  label={stat.stat.name}
                />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t-2 border-[#0f380f]">
              <div className="flex justify-between text-[#0f380f]">
                <span className="uppercase font-bold">Total</span>
                <div className="flex gap-2 items-center">
                  <span className="font-bold">{getTotalStats(selectedPokemon2)}</span>
                  <span className={`text-sm ${
                    getTotalStats(selectedPokemon2) > getTotalStats(pokemon1) 
                      ? 'text-green-700' 
                      : getTotalStats(selectedPokemon2) < getTotalStats(pokemon1)
                        ? 'text-red-700'
                        : ''
                  }`}>
                    ({getTotalStats(selectedPokemon2) - getTotalStats(pokemon1) > 0 ? '+' : ''}
                    {getTotalStats(selectedPokemon2) - getTotalStats(pokemon1)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#98cb98] border-2 border-[#0f380f] p-4 flex items-center justify-center h-full">
            <p className="text-[#0f380f] text-center uppercase">
              {t('searchToCompare')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 