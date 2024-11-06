export function useGameBoyTheme(isDark) {
  return {
    background: isDark ? '#0f380f' : '#8b956d',
    primary: isDark ? '#306230' : '#9bac7a',
    secondary: isDark ? '#4a7340' : '#98cb98',
  };
} 