import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '16px',
        sm: '16px',
        lg: '24px',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
      },
    },
    extend: {
      colors: {
        // SelfGrow Design System Palette
        primary: {
          DEFAULT: '#1769F5',
          hover: '#1056D5',
          light: '#EAF2FF',
          dark: '#1056D5',
        },
        navy: '#12346B',
        'dark-navy': '#0B1F44',
        'light-blue': '#EAF2FF',
        background: '#F5F8FF',
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F0F5FF',
        },
        heading: '#142B50',
        body: '#526581',
        muted: '#8291A8',
        border: {
          DEFAULT: '#E5EDFA',
          subtle: '#E5EDFA',
        },
        'input-border': '#DCE6F5',
        success: {
          DEFAULT: '#16A36A',
          light: '#E7F7EF',
          dark: '#128755',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
        },
        danger: {
          DEFAULT: '#E5484D',
          light: '#FEE2E2',
          dark: '#DC2626',
        },
        purple: {
          DEFAULT: '#7657D5',
          light: '#F3EEFF',
          dark: '#613ec9',
        },

        // Aliases for compatibility
        brand: {
          50: '#EAF2FF',
          100: '#D6E4FE',
          200: '#ADC9FD',
          300: '#84AEFC',
          400: '#4D8CF9',
          500: '#1769F5',
          600: '#1769F5', // Primary brand color
          700: '#1056D5',
          800: '#12346B',
          900: '#0B1F44',
          950: '#061127',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-devanagari)', 'sans-serif'],
        hindi: ['var(--font-devanagari)', 'var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(18, 52, 107, 0.05)',
        hover: '0 8px 28px rgba(18, 52, 107, 0.10)',
        dropdown: '0 10px 30px rgba(18, 52, 107, 0.08)',
        modal: '0 20px 40px rgba(11, 31, 68, 0.16)',
      },
    },
  },
  plugins: [],
};

export default config;
