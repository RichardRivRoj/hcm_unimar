'use client'
import { createContext, useState, useContext } from 'react'

const NavigationContext = createContext()

export const NavigationProvider = ({ children }) => {
  const [navigation, setNavigation] = useState({
    currentSection: 0,
    currentQuestion: 0
  })

  const updateNavigation = (section, question) => {
    setNavigation({
      currentSection: section,
      currentQuestion: question
    })
  }

  return (
    <NavigationContext.Provider value={{ navigation, updateNavigation }}>
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation debe usarse dentro de NavigationProvider')
  }
  return context
}