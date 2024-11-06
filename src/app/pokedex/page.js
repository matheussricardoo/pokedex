'use client';
import { useState, useEffect } from 'react';
import PokemonCard from '@/components/PokemonCard';
import PokemonModal from '@/components/PokemonModal';
import Link from 'next/link';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import PokemonQuiz from '@/components/features/PokemonQuiz';

export default function Pokedex() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [generation, setGeneration] = useState(1);
  const [currentView, setCurrentView] = useState('pokedex');
  const { t } = useLanguage();

  const types = [
    'all', 'grass', 'fire', 'water', 'bug', 'normal', 'poison', 
    'electric', 'ground', 'fairy', 'fighting', 'psychic', 'rock', 
    'ghost', 'ice', 'dragon', 'dark', 'steel', 'flying'
  ];

  const generations = {
    1: { start: 1, end: 151 },
    2: { start: 152, end: 251 },
    3: { start: 252, end: 386 },
    4: { start: 387, end: 493 },
    5: { start: 494, end: 649 }
  };

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const { start, end } = generations[generation];
        const limit = end - start + 1;
        const offset = start - 1;
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
          })
        );
        
        setPokemon(pokemonDetails);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar Pokemon:', error);
        setLoading(false);
      }
    }

    setLoading(true);
    fetchPokemon();
  }, [generation]);

  const filteredPokemon = pokemon.filter((poke) => {
    const matchesSearch = poke.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poke.id.toString().includes(searchTerm);
    const matchesType = selectedType === 'all' || selectedType === '' ||
                       poke.types.some(type => type.type.name === selectedType);
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#8b956d] flex items-center justify-center">
        <div className="w-24 h-24 relative animate-spin">
          <div className="absolute inset-0 bg-[#306230] rounded-full border-4 border-[#0f380f]">
            <div className="absolute inset-x-0 top-1/2 h-2 bg-[#0f380f]" />
            <div className="absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2
                           bg-[#98cb98] rounded-full border-4 border-[#0f380f]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#8b956d]">
      <nav className="sticky top-0 bg-[#306230] shadow-lg p-2 sm:p-4 z-40">
        <div className="max-w-6xl mx-auto px-2">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Link
              href="/"
              className="px-3 py-2 bg-[#98cb98] border-2 border-[#0f380f] text-[#0f380f]
                       hover:bg-[#306230] hover:text-[#98cb98] transition-colors 
                       text-xs sm:text-sm uppercase flex items-center gap-2
                       min-w-[100px] justify-center"
            >
              <span>←</span>
              <span>{t('back')}</span>
            </Link>
            
            <h1 className="text-2xl sm:text-3xl text-[#98cb98] font-bold animate-pulse">
              POKEDEX
            </h1>
            
            <LanguageToggle />
          </div>

          {/* Opções principais */}
          <div className="flex justify-center gap-4 mb-6">
            {[
              { id: 'pokedex', label: 'POKEDEX' },
              { id: 'quiz', label: 'QUIZ' }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setCurrentView(view.id)}
                className={`px-6 py-2 border-2 border-[#98cb98] text-sm
                           ${currentView === view.id 
                             ? 'bg-[#98cb98] text-[#0f380f]' 
                             : 'bg-transparent text-[#98cb98] hover:bg-[#98cb98]/20'}`}
              >
                {view.label}
              </button>
            ))}
          </div>

          {currentView === 'pokedex' && (
            <>
              {/* Seletor de Geração */}
              <div className="flex justify-start sm:justify-center mb-4 sm:mb-6 gap-2 overflow-x-auto pb-2 sm:pb-0">
                {Object.keys(generations).map((gen) => (
                  <button
                    key={gen}
                    onClick={() => setGeneration(Number(gen))}
                    className={`px-3 sm:px-4 py-1 sm:py-2 border-2 border-[#98cb98] text-xs sm:text-sm whitespace-nowrap
                               ${generation === Number(gen) 
                                 ? 'bg-[#98cb98] text-[#0f380f]' 
                                 : 'bg-transparent text-[#98cb98] hover:bg-[#98cb98]/20'}`}
                  >
                    GEN {gen}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center">
                {/* Barra de busca */}
                <div className="relative w-full sm:w-96">
                  <input
                    type="text"
                    placeholder={t('search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 bg-[#98cb98] border-2 border-[#0f380f] text-[#0f380f] 
                             placeholder-[#0f380f]/70 focus:outline-none text-xs sm:text-sm uppercase"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f380f]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filtros */}
                <div className="flex gap-2 sm:gap-4">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-2 sm:px-4 py-2 bg-[#98cb98] border-2 border-[#0f380f] text-[#0f380f]
                             focus:outline-none text-xs sm:text-sm uppercase flex-1 sm:flex-none"
                  >
                    <option value="">{t('types')}</option>
                    {types.map((type) => (
                      <option key={type} value={type} className="uppercase">
                        {type}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="px-3 sm:px-4 py-2 bg-[#98cb98] border-2 border-[#0f380f] text-[#0f380f]
                             hover:bg-[#306230] hover:text-[#98cb98] transition-colors 
                             text-xs sm:text-sm uppercase min-w-[80px] sm:min-w-[100px]"
                  >
                    {t(viewMode === 'grid' ? 'list' : 'grid')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-3 sm:p-8">
        {currentView === 'pokedex' ? (
          // Lista de Pokémon
          filteredPokemon.length === 0 ? (
            <div className="text-[#98cb98] text-center py-12 sm:py-20 bg-[#306230] border-2 border-[#0f380f] p-4 sm:p-8">
              <p className="text-lg sm:text-xl mb-2">{t('noResults')}</p>
              <p className="text-xs sm:text-sm">{t('tryAgain')}</p>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6'
                : 'flex flex-col gap-2 sm:gap-4'
              }
            `}>
              {filteredPokemon.map((poke, index) => (
                <PokemonCard
                  key={poke.id}
                  pokemon={poke}
                  onClick={setSelectedPokemon}
                  index={index}
                />
              ))}
            </div>
          )
        ) : (
          // Quiz
          <PokemonQuiz />
        )}
      </div>

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          setSelectedPokemon={setSelectedPokemon}
        />
      )}
    </div>
  );
} 