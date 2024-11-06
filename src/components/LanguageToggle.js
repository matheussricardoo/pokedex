'use client';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 bg-[#98cb98] border-2 border-[#0f380f] text-[#0f380f]
                hover:bg-[#306230] hover:text-[#98cb98] transition-colors 
                text-xs sm:text-sm uppercase"
    >
      {language === 'pt' ? 'EN' : 'PT'}
    </button>
  );
} 