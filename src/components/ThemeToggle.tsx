import { useTheme } from "@/context/theme-context"

export const ThemeToggle = () => {
  const { theme, toggleTheme, setTheme } = useTheme()

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return '☀️'
      case 'dark': return '🌙'
      case 'green': return '🌿'
      default: return '🎨'
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Light'
      case 'dark': return 'Dark'
      case 'green': return 'Green'
      default: return 'Theme'
    }
  }

  return (
    <div className="relative group">
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        <span className="text-lg">{getThemeIcon()}</span>
        <span className="hidden md:inline text-sm">{getThemeLabel()}</span>
      </button>
      
      {/* Theme selection dropdown */}
      <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="py-1">
          <button 
            onClick={() => setTheme('light')}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            ☀️ Light
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            🌙 Dark
          </button>
          <button 
            onClick={() => setTheme('green')}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            🌿 Green
          </button>
        </div>
      </div>
    </div>
  )
}