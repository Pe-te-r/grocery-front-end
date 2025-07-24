module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Green Theme (Primary)
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        
        // Theme colors
        light: {
          bg: '#ffffff',
          surface: '#f8fafc',
          text: '#1e293b',
          textSecondary: '#64748b',
          border: '#e2e8f0',
          accent: '#22c55e',
        },
        
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          text: '#f8fafc',
          textSecondary: '#94a3b8',
          border: '#334155',
          accent: '#4ade80',
        },
        
        green: {
          bg: '#f0fdf4',
          surface: '#dcfce7',
          text: '#14532d',
          textSecondary: '#166534',
          border: '#86efac',
          accent: '#15803d',
        },
      },
    },
  },
  plugins: [],
}