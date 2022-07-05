import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { CoinSelectedDarkIcon, CoinSelectedLightIcon } from '@shared/svg';

interface Props {
  size: number;
  className?: string;
}

export const CoinSelectedIcon: FC<Props> = ({ size, className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const isDarkTheme = colorThemeMode === ColorModes.Dark;

  return isDarkTheme ? (
    <CoinSelectedDarkIcon size={size} className={className} />
  ) : (
    <CoinSelectedLightIcon size={size} className={className} />
  );
};
