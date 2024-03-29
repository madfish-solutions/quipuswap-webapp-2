import { createContext, useEffect, useState } from 'react';

import { noop } from 'rxjs';

import { COLOR_MODE_STORAGE_KEY } from '@config/localstorage';
import { CFC } from '@shared/types';

export enum ColorModes {
  Light = 'light',
  Dark = 'dark'
}

interface ThemeColorsPros {
  fill1: string;
  fill1Inverse: string;
  fill2: string;
  fill2Inverse: string;
  stroke: string;
  background1: string;
  background2: string;
  fillLogo: string;
  fillIconCategories: string;
}

const themeColorsObj = {
  light: {
    fill1: '#5C1EE0',
    fill1Inverse: '#FF6B00',
    fill2: '#1373E4',
    fill2Inverse: '#F9A605',
    stroke: '#FFFFFF',
    background1: '#F0F1F3',
    background2: '#FAFAFC',
    fillLogo: '#232735',
    fillIconCategories: '#070C12'
  },
  dark: {
    fill1: '#FF6B00',
    fill1Inverse: '#5C1EE0',
    fill2: '#F9A605',
    fill2Inverse: '#1373E4',
    stroke: '#14171E',
    background1: '#070C12',
    background2: '#14171E',
    fillLogo: '#FFFFFF',
    fillIconCategories: '#FFFFFF'
  }
};

interface ColorThemeContextValue {
  colorThemeMode: ColorModes;
  themeColors: ThemeColorsPros;
  setColorThemeMode: () => void;
  setThemeColors: (mode: ColorModes) => void;
}

export const defaultDataContext: ColorThemeContextValue = {
  colorThemeMode: ColorModes.Light,
  themeColors: themeColorsObj.light,
  setColorThemeMode: noop,
  setThemeColors: noop
};

export const ColorThemeContext = createContext<ColorThemeContextValue>(defaultDataContext);

export const ColorThemeProvider: CFC = ({ children }) => {
  const [colorThemeMode, setColorThemeMode] = useState(ColorModes.Dark);
  const [themeColors, setThemeColors] = useState(themeColorsObj.dark);

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
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode(ColorModes.Dark);
    } else {
      setMode(ColorModes.Light);
    }
  }, []);

  useEffect(() => {
    if (colorThemeMode === ColorModes.Light) {
      setThemeColors(themeColorsObj.light);
    } else {
      setThemeColors(themeColorsObj.dark);
    }
  }, [colorThemeMode]);

  return (
    <ColorThemeContext.Provider
      value={{
        colorThemeMode,
        themeColors,
        setColorThemeMode: toggleColorTheme,
        setThemeColors: (theme: ColorModes) => setColorThemeMode(theme)
      }}
    >
      {children}
    </ColorThemeContext.Provider>
  );
};
