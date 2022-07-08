import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { CoinSelectedDarkIcon, CoinSelectedLightIcon } from '@shared/svg';

interface Props {
  className?: string;
}

export const CoinSelectedIcon: FC<Props> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const isDarkTheme = colorThemeMode === ColorModes.Dark;

  return isDarkTheme ? <CoinSelectedDarkIcon className={className} /> : <CoinSelectedLightIcon className={className} />;
};
