import { createContext, useContext, ReactNode } from 'react';

interface NavigationContextType {
  // Add navigation methods here if needed
}

const NavigationContext = createContext<NavigationContextType>({});

export const useNavigation = () => useContext(NavigationContext);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const value = {
    // Navigation implementation
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
