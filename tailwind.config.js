/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pokemon: {
          grass: '#78C850',
          fire: '#F08030',
          water: '#6890F0',
          bug: '#A8B820',
          normal: '#A8A878',
          poison: '#A040A0',
          electric: '#F8D030',
          ground: '#E0C068',
          fairy: '#EE99AC',
          fighting: '#C03028',
          psychic: '#F85888',
          rock: '#B8A038',
          ghost: '#705898',
          ice: '#98D8D8',
          dragon: '#7038F8',
          dark: '#705848',
          steel: '#B8B8D0',
          flying: '#A890F0',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'battle-left': 'battleLeft 1s ease-in-out',
        'battle-right': 'battleRight 1s ease-in-out',
        'catch': 'catch 2s ease-in-out',
        'flash': 'flash 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        battleLeft: {
          '0%': { transform: 'translateX(-100%) scale(0.8)', opacity: '0' },
          '100%': { transform: 'translateX(0) scale(1)', opacity: '1' },
        },
        battleRight: {
          '0%': { transform: 'translateX(100%) scale(0.8)', opacity: '0' },
          '100%': { transform: 'translateX(0) scale(1)', opacity: '1' },
        },
        catch: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(0.8) rotate(180deg)' },
          '50%': { transform: 'scale(1.2) rotate(360deg)' },
          '75%': { transform: 'scale(0.9) rotate(540deg)' },
          '100%': { transform: 'scale(1) rotate(720deg)' },
        },
        flash: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
