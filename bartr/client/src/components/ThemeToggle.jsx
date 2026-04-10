import { useContext } from 'react'
import ThemeContext from '../context/themeContext.jsx'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex items-center justify-center w-9 h-9 rounded-xl 
                 bg-bartr-surface border border-bartr-border hover:border-yellow-300 
                 transition-all duration-300 shadow-sm overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <div className={`absolute inset-0 transition-all duration-500 transform 
                        ${theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-0'}`}>
          <Sun className="w-5 h-5 text-yellow-300 fill-yellow-300" />
        </div>
        <div className={`absolute inset-0 transition-all duration-500 transform 
                        ${theme === 'dark' ? '-rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'}`}>
          <Moon className="w-5 h-5 text-bartr-muted group-hover:text-bartr-dark" />
        </div>
      </div>
    </button>
  )
}