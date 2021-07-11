import React, { useEffect, useState } from 'react';

import { COLOR_MODE_STORAGE_KEY } from '@utils/defaults';

export enum ColorModes {
  Light = 'light',
  Dark = 'dark',
}

type ThemeColorsPros = {
  fill1: string
  fill2: string
  stroke: string
  background1: string
  background2: string
};

const themeColorsObj = {
  light: {
    fill1: '#5C1EE0',
    fill2: '#1373E4',
    stroke: '#ffffff',
    background1: '#F0F1F3',
    background2: '#FAFAFC',
  },
  dark: {
    fill1: '#FF6B00',
    fill2: '#F9A605',
    stroke: '#14171E',
    background1: '#070C12',
    background2: '#14171E',
  },
};

type ColorThemeContextValue = {
  colorThemeMode: ColorModes
  isComponentDidMount: boolean
  inactiveIconColor: string,
  themeColors: ThemeColorsPros
  setColorThemeMode: () => void
};

export const defaultDataContext: ColorThemeContextValue = {
  colorThemeMode: ColorModes.Light,
  isComponentDidMount: false,
  inactiveIconColor: '#8B90A0',
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
  });

  return (
    <ColorThemeContext.Provider value={{
      colorThemeMode,
      isComponentDidMount,
      themeColors,
      inactiveIconColor: defaultDataContext.inactiveIconColor,
      setColorThemeMode: toggleColorTheme,
    }}
    >
      {children}
    </ColorThemeContext.Provider>
  );
};
