'use client'
import Link from "next/link";
import { useState, useEffect } from "react";
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const [isBooting, setIsBooting] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-[#306230] flex items-center justify-center">
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
    <div className="fixed inset-0 bg-[#8b956d] overflow-hidden">
      {/* Grid de fundo decorativo */}
      <div className="absolute inset-0 grid grid-cols-8 sm:grid-cols-12 gap-1 opacity-10 pointer-events-none">
        {[...Array(144)].map((_, i) => (
          <div key={i} className="aspect-square border border-[#0f380f]" />
        ))}
      </div>

      {/* Botão de idioma */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageToggle />
      </div>

      <main className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Pokébola animada */}
        <div className="relative w-40 h-40 sm:w-64 sm:h-64 mb-6 sm:mb-8 group">
          <div className="absolute inset-0 bg-[#306230] rounded-full border-4 border-[#0f380f]
                         group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-x-0 top-1/2 h-4 bg-[#0f380f]" />
            <div className="absolute left-1/2 top-1/2 w-8 sm:w-12 h-8 sm:h-12 -translate-x-1/2 -translate-y-1/2
                           bg-[#98cb98] rounded-full border-4 border-[#0f380f]
                           group-hover:animate-pulse" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="bg-[#306230] border-4 border-[#0f380f] p-4 sm:p-8 w-full max-w-2xl mx-4
                       transform hover:translate-y-[-4px] transition-transform duration-300"
             style={{ boxShadow: '0 6px 0 #0f380f' }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#98cb98] mb-4 sm:mb-6 uppercase
                         animate-fade-in">
            POKEDEX
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-center text-[#98cb98]/90 mb-6 sm:mb-8 animate-fade-in"
             style={{ animationDelay: '0.2s' }}>
            {t('homeDescription')}
          </p>

          <div className="flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link 
              href="/pokedex"
              className="bg-[#98cb98] border-2 border-[#0f380f] py-3 sm:py-4 px-6 sm:px-8 text-center
                       text-[#0f380f] uppercase font-bold text-base sm:text-lg
                       hover:bg-[#0f380f] hover:text-[#98cb98] transition-colors
                       relative group"
            >
              <span className="relative z-10">{t('openPokedex')}</span>
              <div className="absolute inset-0 bg-[#0f380f] transform origin-left scale-x-0 
                           group-hover:scale-x-100 transition-transform duration-300" />
            </Link>

            {/* Instruções atualizadas */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#98cb98] text-xs sm:text-sm">
              <div className="border-2 border-[#98cb98] p-2 sm:p-3">
                <h3 className="font-bold mb-2 uppercase">{t('features')}</h3>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>{t('feature1')}</li>
                  <li>{t('feature2')}</li>
                  <li>{t('feature3')}</li>
                  <li>{t('feature4')}</li>
                </ul>
              </div>
              <div className="border-2 border-[#98cb98] p-2 sm:p-3">
                <h3 className="font-bold mb-2 uppercase">{t('howToUse')}</h3>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>{t('usage1')}</li>
                  <li>{t('usage2')}</li>
                  <li>{t('usage3')}</li>
                  <li>{t('usage4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Decoração de cantos - escondida em telas muito pequenas */}
        <div className="hidden sm:block absolute top-4 left-4 w-6 sm:w-8 h-6 sm:h-8 border-t-4 border-l-4 border-[#0f380f]" />
        <div className="hidden sm:block absolute top-4 right-4 w-6 sm:w-8 h-6 sm:h-8 border-t-4 border-r-4 border-[#0f380f]" />
        <div className="hidden sm:block absolute bottom-4 left-4 w-6 sm:w-8 h-6 sm:h-8 border-b-4 border-l-4 border-[#0f380f]" />
        <div className="hidden sm:block absolute bottom-4 right-4 w-6 sm:w-8 h-6 sm:h-8 border-b-4 border-r-4 border-[#0f380f]" />
      </main>
    </div>
  );
}
