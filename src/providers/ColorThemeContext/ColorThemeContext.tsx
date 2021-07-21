import React, { useEffect, useState } from 'react';

import { COLOR_MODE_STORAGE_KEY } from '@utils/defaults';

export enum ColorModes {
  Light = 'light',
  Dark = 'dark',
}

type ThemeColorsPros = {
  fill1: string
  fill2: string
  fill3: string
  stroke: string
  stroke2: string
  background1: string
  background2: string
};

const themeColorsObj = {
  light: {
    fill1: '#5C1EE0',
    fill2: '#1373E4',
    fill3: '#FFFFFF',
    stroke: '#ffffff',
    stroke2: '#F0F1F3',
    background1: '#F0F1F3',
    background2: '#FAFAFC',
  },
  dark: {
    fill1: '#FF6B00',
    fill2: '#F9A605',
    fill3: '#070C12',
    stroke: '#14171E',
    stroke2: '#232735',
    background1: '#070C12',
    background2: '#14171E',
  },
};

type ColorThemeContextValue = {
  colorThemeMode: ColorModes
  isComponentDidMount: boolean
  themeColors: ThemeColorsPros
  setColorThemeMode: () => void
};

export const defaultDataContext: ColorThemeContextValue = {
  colorThemeMode: ColorModes.Light,
  isComponentDidMount: false,
  themeColors: themeColorsObj.light,
  setColorThemeMode: () => {},
};

export const ColorThemeContext = React.createContext<ColorThemeContextValue>(defaultDataContext);

export const ColorThemeProvider: React.FC = ({ children }) => {
  const [colorThemeMode, setColorThemeMode] = useState(ColorModes.Light);
  const [themeColors, setThemeColors] = useState(themeColorsObj.light);
  const [isComponentDidMount, setIsComponentDidMount] = useState(false);

  const setMode = (mode: ColorModes) => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
    setColorThemeMode(mode);
  };

  const toggleColorTheme = () => {
    if (colorThemeMode === ColorModes.Light) {
      setMode(ColorModes.Dark);
    } else {
      setMode(ColorModes.Light);
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY) as ColorModes;
    if (localTheme) {
      setColorThemeMode(localTheme);
    } else if (
      window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setMode(ColorModes.Dark);
    } else {
      setMode(ColorModes.Light);
    }
    setIsComponentDidMount(true);
  }, []);

  useEffect(() => {
    if (colorThemeMode === ColorModes.Light) {
      setThemeColors(themeColorsObj.light);
    } else {
      setThemeColors(themeColorsObj.dark);
    }
  }, [colorThemeMode]);

  return (
    <ColorThemeContext.Provider value={{
      colorThemeMode,
      isComponentDidMount,
      themeColors,
      setColorThemeMode: toggleColorTheme,
    }}
    >
      {children}
    </ColorThemeContext.Provider>
  );
};
