import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Landing page — light theme
        electric: '#1B1BFF',
        'electric-dark': '#1010CC',
        brand: {
          green: '#00C853',
          coral: '#FF6B35',
          pink: '#E040FB',
        },
        // Canvas — stays dark
        canvas: {
          bg: '#1e1e1e',
          panel: '#252526',
          border: '#3e3e42',
          accent: '#0e7490',
          'accent-hover': '#0891b2',
          text: '#cccccc',
          'text-muted': '#858585',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'float-slow': 'float-slow 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
