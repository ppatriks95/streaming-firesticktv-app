
import { createContext, useContext, useEffect, useState } from 'react';

interface NavigationContextType {
  focusedElement: string | null;
  setFocusedElement: (element: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Fire TV remote simulation with keyboard
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          event.preventDefault();
          console.log('D-Pad navigation:', event.key);
          break;
        case 'Enter':
        case ' ': // Space bar as OK button
          event.preventDefault();
          console.log('OK button pressed');
          break;
        case 'Escape':
          event.preventDefault();
          console.log('Back button pressed');
          break;
        case 'Home':
          event.preventDefault();
          console.log('Home button pressed');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <NavigationContext.Provider value={{ focusedElement, setFocusedElement }}>
      {children}
    </NavigationContext.Provider>
  );
};
