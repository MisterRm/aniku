import { AccentColor, TextSize, GridLayout, DataSource } from "../types";

export const ACCENTS = {
  red: {
    hex: '#E53935',
    bg: 'bg-brand-red',
    text: 'text-brand-red',
    border: 'border-brand-red',
    focus: 'focus:border-brand-red/50',
    hover: 'hover:bg-brand-red/10',
    gradient: 'from-brand-red/20 to-transparent',
    glowingText: 'text-brand-red drop-shadow-[0_0_8px_rgba(229,57,53,0.3)]',
    glowingBg: 'bg-brand-red shadow-[0_0_15px_rgba(229,57,53,0.4)]',
    glowingBorder: 'border-brand-red hover:shadow-[0_0_10px_rgba(229,57,53,0.3)]',
  },
  green: {
    hex: '#4CAF50',
    bg: 'bg-brand-green',
    text: 'text-brand-green',
    border: 'border-brand-green',
    focus: 'focus:border-brand-green/50',
    hover: 'hover:bg-brand-green/10',
    gradient: 'from-brand-green/20 to-transparent',
    glowingText: 'text-brand-green drop-shadow-[0_0_8px_rgba(76,175,80,0.3)]',
    glowingBg: 'bg-brand-green shadow-[0_0_15px_rgba(76,175,80,0.4)]',
    glowingBorder: 'border-brand-green hover:shadow-[0_0_10px_rgba(76,175,80,0.3)]',
  },
  blue: {
    hex: '#2196F3',
    bg: 'bg-brand-blue',
    text: 'text-brand-blue',
    border: 'border-brand-blue',
    focus: 'focus:border-brand-blue/50',
    hover: 'hover:bg-brand-blue/10',
    gradient: 'from-brand-blue/20 to-transparent',
    glowingText: 'text-brand-blue drop-shadow-[0_0_8px_rgba(33,150,243,0.3)]',
    glowingBg: 'bg-brand-blue shadow-[0_0_15px_rgba(33,150,243,0.4)]',
    glowingBorder: 'border-brand-blue hover:shadow-[0_0_10px_rgba(33,150,243,0.3)]',
  },
  purple: {
    hex: '#9C27B0',
    bg: 'bg-brand-purple',
    text: 'text-brand-purple',
    border: 'border-brand-purple',
    focus: 'focus:border-brand-purple/50',
    hover: 'hover:bg-brand-purple/10',
    gradient: 'from-brand-purple/20 to-transparent',
    glowingText: 'text-brand-purple drop-shadow-[0_0_8px_rgba(156,39,176,0.3)]',
    glowingBg: 'bg-brand-purple shadow-[0_0_15px_rgba(156,39,176,0.4)]',
    glowingBorder: 'border-brand-purple hover:shadow-[0_0_10px_rgba(156,39,176,0.3)]',
  },
  orange: {
    hex: '#FF9800',
    bg: 'bg-brand-orange',
    text: 'text-brand-orange',
    border: 'border-brand-orange',
    focus: 'focus:border-brand-orange/50',
    hover: 'hover:bg-brand-orange/10',
    gradient: 'from-brand-orange/20 to-transparent',
    glowingText: 'text-brand-orange drop-shadow-[0_0_8px_rgba(255,152,0,0.3)]',
    glowingBg: 'bg-brand-orange shadow-[0_0_15px_rgba(255,152,0,0.4)]',
    glowingBorder: 'border-brand-orange hover:shadow-[0_0_10px_rgba(255,152,0,0.3)]',
  }
};

export function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
}

export function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

export function getSavedAccent(): AccentColor {
  const color = localStorage.getItem('aniku_color_accent') as AccentColor;
  return ACCENTS[color] ? color : 'red';
}

export function getSavedTextSize(): TextSize {
  const size = localStorage.getItem('aniku_text_size') as TextSize;
  return ['kecil', 'sedang', 'besar'].includes(size) ? size : 'sedang';
}

export function getSavedGridLayout(): GridLayout {
  const layout = localStorage.getItem('aniku_grid_layout') as GridLayout;
  return ['cols-2', 'cols-3', 'list'].includes(layout) ? layout : 'cols-3';
}

export function getSavedDataSource(): DataSource {
  const src = getCookie('data_source') as DataSource;
  if (src === 'Dayynime-v1' || src === 'Dayynime-v2') return src;
  
  // Try localstorage fallback
  const lsSrc = localStorage.getItem('aniku_data_source') as DataSource;
  if (lsSrc === 'Dayynime-v1' || lsSrc === 'Dayynime-v2') {
    setCookie('data_source', lsSrc);
    return lsSrc;
  }

  // Default is Animasu (Dayynime-v1)
  setCookie('data_source', 'Dayynime-v1');
  return 'Dayynime-v1';
}

export function saveSettings(accent: AccentColor, textSize: TextSize, gridLayout: GridLayout, dataSource: DataSource) {
  localStorage.setItem('aniku_color_accent', accent);
  localStorage.setItem('aniku_text_size', textSize);
  localStorage.setItem('aniku_grid_layout', gridLayout);
  localStorage.setItem('aniku_data_source', dataSource);
  setCookie('data_source', dataSource);
}
