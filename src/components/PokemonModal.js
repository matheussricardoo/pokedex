'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import CompareMode from '@/components/CompareMode';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  en: {
    shinyVersion: "Shiny Version",
    normalVersion: "Normal Version",
    evolutions: "Evolutions",
    level: "Level",
    info: "Info",
    compare: "Compare",
    baseStats: "Base Stats",
    close: "Close"
  },
  pt: {
    shinyVersion: "Versão Shiny",
    normalVersion: "Versão Normal",
    evolutions: "Evoluções",
    level: "Nível",
    info: "Info",
    compare: "Comparar",
    baseStats: "Status Base",
    close: "Fechar"
  }
};

export default function PokemonModal({ pokemon, onClose, onPokemonChange }) {
  const [currentSprite, setCurrentSprite] = useState('default');
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('info');
  const { t, language } = useLanguage();

  useEffect(() => {
    async function fetchEvolutionChain() {
      try {
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();
        
        const chain = [];
        let currentEvolution = evolutionData.chain;
        
        while (currentEvolution) {
          const pokemonName = currentEvolution.species.name;
          const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
          const pokemonData = await pokemonResponse.json();
          
          chain.push({
            name: pokemonName,
            image: pokemonData.sprites.other['official-artwork'].front_default,
            id: pokemonData.id,
            min_level: currentEvolution.evolution_details[0]?.min_level || null
          });
          
          currentEvolution = currentEvolution.evolves_to[0];
        }
        
        setEvolutionChain(chain);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar evoluções:', error);
        setLoading(false);
      }
    }

    fetchEvolutionChain();
  }, [pokemon]);

  const sprites = {
    default: pokemon.sprites.other['official-artwork'].front_default,
    shiny: pokemon.sprites.other['official-artwork'].front_shiny,
    classic: pokemon.sprites.front_default,
    classicShiny: pokemon.sprites.front_shiny
  };

  const handleEvolutionClick = (evolutionPokemon) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${evolutionPokemon.name}`)
      .then(res => res.json())
      .then(data => {
        onPokemonChange(data);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#9bac7a] border-4 border-[#0f380f] max-w-4xl w-full animate-fade-in p-6 
                    max-h-[90vh] overflow-y-auto relative">
        {/* Botão de fechar no canto superior direito */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-[#306230] border-2 border-[#0f380f] 
                   text-[#98cb98] flex items-center justify-center
                   hover:bg-[#98cb98] hover:text-[#0f380f] transition-colors z-20"
        >
          ✕
        </button>

        {/* Bolinhas animadas */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-blink"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-blink" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-blink" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Botões de navegação */}
        <div className="flex gap-2 mb-6 bg-[#306230] p-2 border-2 border-[#0f380f] mt-8">
          {['info', 'compare'].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-4 py-2 border-2 border-[#0f380f] text-sm uppercase transition-all
                       ${currentView === view 
                         ? 'bg-[#98cb98] text-[#0f380f]' 
                         : 'bg-[#0f380f] text-[#98cb98] hover:bg-[#0f380f]/80'}`}
            >
              {t(view)}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="bg-[#306230] border-2 border-[#0f380f] p-4">
          {currentView === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#98cb98] border-2 border-[#0f380f] p-4">
                <div className="aspect-square relative bg-[#306230] border-2 border-[#0f380f]">
                  <Image
                    src={currentSprite === 'shiny' 
                      ? pokemon.sprites.other['official-artwork'].front_shiny 
                      : pokemon.sprites.other['official-artwork'].front_default}
                    alt={pokemon.name}
                    fill
                    className="object-contain p-8"
                  />
                </div>
                {/* Botão Shiny */}
                <button
                  onClick={() => setCurrentSprite(currentSprite === 'shiny' ? 'default' : 'shiny')}
                  className={`w-full mt-4 py-2 border-2 border-[#0f380f] uppercase text-sm
                             transition-colors ${currentSprite === 'shiny' 
                               ? 'bg-[#306230] text-[#98cb98]' 
                               : 'bg-[#98cb98] text-[#0f380f] hover:bg-[#306230] hover:text-[#98cb98]'}`}
                >
                  {currentSprite === 'shiny' ? t('normalVersion') : t('shinyVersion')}
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#98cb98] border-2 border-[#0f380f] p-4">
                  <h2 className="text-2xl text-[#0f380f] uppercase mb-1">
                    {pokemon.name} {currentSprite === 'shiny' && '(Shiny)'}
                  </h2>
                  <p className="text-[#0f380f]/70">#{String(pokemon.id).padStart(3, '0')}</p>
                </div>

                <div className="bg-[#98cb98] border-2 border-[#0f380f] p-4">
                  <h3 className="text-[#0f380f] uppercase mb-4">{t('baseStats')}</h3>
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name} className="mb-3">
                      <div className="flex justify-between text-sm text-[#0f380f] mb-1">
                        <span className="uppercase">{stat.stat.name}</span>
                        <span>{stat.base_stat}</span>
                      </div>
                      <div className="h-2 bg-[#0f380f]">
                        <div
                          className="h-full bg-[#98cb98] transition-all duration-500"
                          style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cadeia evolutiva */}
              {!loading && evolutionChain && (
                <div className="md:col-span-2 bg-[#98cb98] border-2 border-[#0f380f] p-4 overflow-x-auto">
                  <h3 className="text-[#0f380f] uppercase mb-6">{t('evolutions')}</h3>
                  <div className="flex items-center justify-start min-w-max px-4">
                    {evolutionChain.map((evo, index) => (
                      <div key={evo.id} className="flex items-center">
                        <div 
                          className={`flex flex-col items-center cursor-pointer transition-transform hover:scale-105
                                     ${index === 0 ? '-translate-y-2' : ''}`}
                          onClick={() => handleEvolutionClick(evo)}
                        >
                          <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 relative bg-[#306230] 
                                        border-2 border-[#0f380f] p-2 hover:bg-[#3a7a3a] transition-colors">
                            <Image
                              src={evo.image}
                              alt={evo.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="mt-2 text-center">
                            <p className="text-xs sm:text-sm text-[#0f380f] uppercase">
                              {evo.name}
                            </p>
                            {evo.min_level && (
                              <p className="text-xs text-[#0f380f]/70">
                                {t('level')} {evo.min_level}
                              </p>
                            )}
                          </div>
                        </div>
                        {index < evolutionChain.length - 1 && (
                          <div className="flex items-center mx-2 sm:mx-4">
                            <svg 
                              className="w-4 h-4 sm:w-6 sm:h-6 text-[#0f380f]" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === 'compare' && (
            <CompareMode pokemon1={pokemon} />
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-[#306230] text-[#98cb98] border-2 border-[#0f380f]
                   hover:bg-[#98cb98] hover:text-[#0f380f] transition-colors uppercase"
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
} 