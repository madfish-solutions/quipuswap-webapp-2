import {
  QuipuSwapBackDefaultIcon,
  TezosFaceDefaultIcon,
  QuipuSwapFaceDefaultIcon,
  TezosBackDefaultIcon,
  QuipuSwapFaceActiveIcon,
  QuipuSwapBackActiveIcon,
  TezosFaceActiveIcon,
  TezosBackActiveIcon
} from '@shared/svg';

import { CoinSide, TokenToPlay } from '../../stores';
import { CoinflipGameSelectProps } from './coinflip-game-select.props';

export const useCoinflipGameSelectViewModel = ({
  isLoading,
  error,
  tokenToPlay,
  coinSide,
  handleSelectCoinSide
}: CoinflipGameSelectProps) => {
  const iSelectedFace = coinSide === CoinSide.Face;
  const iSelectedBack = coinSide === CoinSide.Back;

  const isTez = tokenToPlay === TokenToPlay.Tezos;

  const getQuipuSwapFaceIcon = () => (iSelectedFace ? QuipuSwapFaceActiveIcon : QuipuSwapFaceDefaultIcon);
  const getQuipuSwapBackIcon = () => (iSelectedBack ? QuipuSwapBackActiveIcon : QuipuSwapBackDefaultIcon);

  const getTezosFaceIcon = () => (iSelectedFace ? TezosFaceActiveIcon : TezosFaceDefaultIcon);
  const getTezosBackIcon = () => (iSelectedBack ? TezosBackActiveIcon : TezosBackDefaultIcon);

  const getFaceIcon = () => (isTez ? getTezosFaceIcon() : getQuipuSwapFaceIcon());
  const getBackIcon = () => (isTez ? getTezosBackIcon() : getQuipuSwapBackIcon());

  const handleSelectSideA = () => handleSelectCoinSide(CoinSide.Face);
  const handleSelectSideB = () => handleSelectCoinSide(CoinSide.Back);

  return {
    isLoading,
    error,
    handleSelectSideA,
    handleSelectSideB,
    FaceIcon: getFaceIcon(),
    BackIcon: getBackIcon()
  };
};
