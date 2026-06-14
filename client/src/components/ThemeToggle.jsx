import { useContext } from 'react'
import ThemeContext from '../context/themeContext.jsx'
import { Sun, Moon } from '@phosphor-icons/react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        relative flex items-center w-14 h-7 rounded-full p-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2
        ${isDark
          ? 'bg-[#6D28D9] shadow-[0_0_12px_rgba(109,40,217,0.4)]'
          : 'bg-[#0B0B0A]/10 hover:bg-[#0B0B0A]/15'
        }
      `}
    >
      {/* Sliding knob */}
      <span
        className={`
          absolute top-0.5 flex items-center justify-center w-6 h-6 rounded-full shadow-md transition-all duration-300 ease-spring
          ${isDark
            ? 'translate-x-7 bg-white'
            : 'translate-x-0.5 bg-white'
          }
        `}
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {isDark
          ? <Sun  className="w-3 h-3 text-[#6D28D9]" weight="fill" />
          : <Moon className="w-3 h-3 text-[#0B0B0A]/60" weight="fill" />
        }
      </span>

      {/* Track labels */}
      <span className={`ml-1 text-[8px] font-bold transition-opacity duration-200 select-none ${isDark ? 'opacity-0' : 'opacity-60 text-[#0B0B0A]'}`}>
        ☀
      </span>
      <span className={`ml-auto mr-1 text-[8px] font-bold transition-opacity duration-200 select-none ${isDark ? 'opacity-70 text-white' : 'opacity-0'}`}>
        ☽
      </span>
    </button>
  )
}