'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function PokemonCard({ pokemon, onClick, index }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const getTypeColor = (type) => {
    return `bg-pokemon-${type}`;
  };

  return (
    <div
      onClick={() => onClick(pokemon)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group bg-[#9bac7a] p-2 sm:p-3 cursor-pointer
                 transform transition-all duration-300 
                 hover:translate-y-[-2px] border-2 border-[#0f380f] animate-fade-in-up`}
      style={{
        transform: isHovered ? 'translateY(-5px)' : 'none',
        boxShadow: isHovered ? '0px 5px 0px #0f380f' : '0px 3px 0px #0f380f',
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div className="aspect-square relative mb-2 sm:mb-4 bg-[#306230] overflow-hidden border-2 border-[#0f380f]">
        <Image
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          fill
          className={`object-contain p-2 sm:p-4 transition-all duration-300
                     ${isLoading ? 'opacity-0' : 'opacity-100'} 
                     ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoadingComplete={() => setIsLoading(false)}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#9bac7a] border-t-transparent"></div>
          </div>
        )}
      </div>
      
      <div className="text-[#0f380f]">
        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <p className="text-[10px] sm:text-xs">No.{String(pokemon.id).padStart(3, '0')}</p>
        </div>
        <h2 className="text-xs sm:text-sm font-bold uppercase mb-1 sm:mb-2 truncate">{pokemon.name}</h2>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className={`px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] text-white uppercase 
                         ${getTypeColor(type.type.name)}
                         border border-[#0f380f] transition-all duration-300
                         hover:brightness-110`}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 