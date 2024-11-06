'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PokemonQuiz() {
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const fetchRandomPokemon = async () => {
    setLoading(true);
    const randomId = Math.floor(Math.random() * 151) + 1;
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      setCurrentPokemon(data);
      setIsRevealed(false);
      setGuess('');
      setMessage('');
    } catch (error) {
      console.error('Erro ao carregar Pokemon:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  const handleGuess = () => {
    if (guess.toLowerCase() === currentPokemon.name.toLowerCase()) {
      setMessage(t('correct'));
      setIsRevealed(true);
    } else {
      setMessage(t('wrong'));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isRevealed) {
      handleGuess();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-[#0f380f] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#306230] border-2 border-[#0f380f] p-4">
      <h2 className="text-[#98cb98] text-xl text-center mb-4">{t('whosThatPokemon')}</h2>
      
      <div className="relative aspect-square max-w-md mx-auto mb-6 bg-[#98cb98] border-2 border-[#0f380f]">
        <Image
          src={currentPokemon?.sprites.other['official-artwork'].front_default}
          alt="Mystery Pokemon"
          fill
          className={`object-contain p-8 transition-all duration-300
                     ${isRevealed ? 'brightness-100' : 'brightness-0'}`}
        />
        {isRevealed && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#98cb98] border-t-2 border-[#0f380f] p-2">
            <p className="text-[#0f380f] text-center uppercase font-bold">
              {currentPokemon.name}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 items-center">
        {!isRevealed && (
          <>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('guess')}
              className="w-full max-w-xs px-4 py-2 bg-[#98cb98] border-2 border-[#0f380f] 
                       text-[#0f380f] placeholder-[#0f380f]/70 focus:outline-none uppercase"
              autoFocus
            />
            <button
              onClick={handleGuess}
              className="px-6 py-2 bg-[#98cb98] border-2 border-[#0f380f] text-[#0f380f]
                       hover:bg-[#306230] hover:text-[#98cb98] transition-colors uppercase"
            >
              {t('guess')}
            </button>
          </>
        )}

        {message && (
          <p className={`text-center ${message === t('correct') ? 'text-[#98cb98]' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        {!isRevealed && (
          <button
            onClick={() => setIsRevealed(true)}
            className="text-[#98cb98] hover:text-[#98cb98]/80 transition-colors uppercase"
          >
            {t('showAnswer')}
          </button>
        )}

        {isRevealed && (
          <button
            onClick={fetchRandomPokemon}
            className="px-6 py-2 bg-[#98cb98] border-2 border-[#0f380f] text-[#0f380f]
                     hover:bg-[#306230] hover:text-[#98cb98] transition-colors uppercase"
          >
            {t('nextPokemon')}
          </button>
        )}
      </div>
    </div>
  );
} 