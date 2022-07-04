import { useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { CoinSideAQuipuIcon, CoinSideATezosIcon, CoinSideBQuipuIcon, CoinSideBTezosIcon } from '@shared/svg';

import { CoinSide, TokenToPlay } from '../../stores';
import { CoinflipGameSelectProps } from './coinflip-game-select.props';

export const useCoinflipGameSelectViewModel = ({
  error,
  tokenToPlay,
  coinSide,
  handleSelectCoinSide
}: CoinflipGameSelectProps) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const isDarkTheme = colorThemeMode === ColorModes.Dark;

  const iSelectedSideA = coinSide === CoinSide.A;
  const iSelectedSideB = coinSide === CoinSide.B;

  const handleSelectSideA = () => handleSelectCoinSide(CoinSide.A);
  const handleSelectSideB = () => handleSelectCoinSide(CoinSide.B);

  const isTez = tokenToPlay === TokenToPlay.Tezos;
  const CoinSideAIcon = isTez ? CoinSideATezosIcon : CoinSideAQuipuIcon;

  const CoinSideBIcon = isTez ? CoinSideBTezosIcon : CoinSideBQuipuIcon;

  return {
    error,
    iSelectedSideA,
    iSelectedSideB,
    handleSelectSideA,
    handleSelectSideB,
    CoinSideAIcon,
    CoinSideBIcon,
    isDarkTheme
  };
};
