
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GLASS_KEY = '@easy_budget_glass_enabled';

interface GlassContextType {
  glassEnabled: boolean;
  setGlassEnabled: (val: boolean) => Promise<void>;
}

interface GlassProviderProps {
  children: React.ReactNode;
  isPremium?: boolean;
}

const GlassContext = createContext<GlassContextType | undefined>(undefined);

export function GlassProvider({ children, isPremium }: GlassProviderProps) {
  const [glassEnabled, setGlassEnabledState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(GLASS_KEY).then(val => {
      if (val === 'true') setGlassEnabledState(true);
    });
  }, []);

  // Auto-disable glass when premium is lost
  useEffect(() => {
    if (isPremium === false) {
      console.log('[GlassContext] Premium lost — disabling glass mode');
      setGlassEnabledState(false);
      AsyncStorage.setItem(GLASS_KEY, 'false').catch(() => {});
    }
  }, [isPremium]);

  const setGlassEnabled = async (val: boolean) => {
    setGlassEnabledState(val);
    await AsyncStorage.setItem(GLASS_KEY, val ? 'true' : 'false');
  };

  return (
    <GlassContext.Provider value={{ glassEnabled, setGlassEnabled }}>
      {children}
    </GlassContext.Provider>
  );
}

export function useGlass() {
  const ctx = useContext(GlassContext);
  if (!ctx) throw new Error('useGlass must be used within GlassProvider');
  return ctx;
}
