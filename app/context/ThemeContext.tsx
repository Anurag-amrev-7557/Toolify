'use client'
import { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({ theme: 'light', toggleTheme: () => {} })

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read initial value synchronously on first render to avoid visual flash.
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('theme') as Theme | null
      return saved ?? 'light'
    } catch (e) {
      return 'light'
    }
  })

  // Keep the theme class on the <html> (documentElement) so global selectors
  // like `.dark body` and transitions on body/html are applied at the same
  // time as component-level styles. Also mirror to <body> for compatibility.
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    try {
      document.body.classList.remove('light', 'dark')
      document.body.classList.add(theme)
    } catch (e) {
      // ignore
    }
    // persist
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {}
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* No theme class here — it's applied to the documentElement for timing consistency */}
      <div>{children}</div>
    </ThemeContext.Provider>
  )
}
