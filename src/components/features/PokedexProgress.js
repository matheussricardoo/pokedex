'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PokedexProgress() {
  const [viewedPokemon, setViewedPokemon] = useState(new Set());
  const { t } = useLanguage();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('viewedPokemon') || '[]');
    setViewedPokemon(new Set(saved));
  }, []);

  const progress = (viewedPokemon.size / 151) * 100;

  return (
    <div className="bg-[#98cb98] border-2 border-[#0f380f] p-4">
      <h3 className="text-[#0f380f] uppercase mb-2">{t('progress')}</h3>
      <div className="h-4 bg-[#306230] border-2 border-[#0f380f]">
        <div
          className="h-full bg-[#98cb98] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[#0f380f] text-sm mt-2">
        {viewedPokemon.size}/151 {t('pokemonSeen')}
      </p>
    </div>
  );
} 