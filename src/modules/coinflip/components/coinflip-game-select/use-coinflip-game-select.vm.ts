import { CoinSideAQuipuIcon, CoinSideATezosIcon } from '@shared/svg';

import { CoinSide, TokenToPlay } from '../../stores';
import { CoinflipGameSelectProps } from './coinflip-game-select.props';

export const useCoinflipGameSelectViewModel = ({
  error,
  tokenToPlay,
  coinSide,
  handleSelectCoinSide
}: CoinflipGameSelectProps) => {
  const iSelectedSideA = coinSide === CoinSide.A;
  const iSelectedSideB = coinSide === CoinSide.B;

  const handleSelectSideA = () => handleSelectCoinSide(CoinSide.A);
  const handleSelectSideB = () => handleSelectCoinSide(CoinSide.B);

  const isTez = tokenToPlay === TokenToPlay.Tezos;
  const CoinSideA = isTez ? CoinSideATezosIcon : CoinSideAQuipuIcon;

  return {
    error,
    iSelectedSideA,
    iSelectedSideB,
    handleSelectSideA,
    handleSelectSideB,
    CoinSideA
  };
};
