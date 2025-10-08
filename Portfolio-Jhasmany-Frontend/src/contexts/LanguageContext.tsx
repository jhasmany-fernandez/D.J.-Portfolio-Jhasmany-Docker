'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'En' | 'Es' | 'Fr' | 'De' | 'Ru'

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  availableLanguages: Language[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('En')
  const availableLanguages: Language[] = ['En', 'Es', 'Fr', 'De', 'Ru']

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('portfolio-language') as Language
    if (savedLanguage && availableLanguages.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem('portfolio-language', language)

    // Add a console log to show the language change
    console.log(`🌐 Language changed to: ${language}`)
  }

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}