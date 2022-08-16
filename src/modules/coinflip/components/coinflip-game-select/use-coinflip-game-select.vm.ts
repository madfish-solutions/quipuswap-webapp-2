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

import animationQuipuData from '../../animations/quipu.json';
import animationTezosData from '../../animations/xtz.json';
import { CoinSide, TokenToPlay } from '../../stores';
import { CoinflipGameSelectProps } from './coinflip-game-select.props';

export const useCoinflipGameSelectViewModel = ({
  isLoading,
  error,
  tokenToPlay,
  coinSide,
  handleSelectCoinSide
}: CoinflipGameSelectProps) => {
  const isHeadSelected = coinSide === CoinSide.Head;
  const isTailSelected = coinSide === CoinSide.Tail;

  const isTez = tokenToPlay === TokenToPlay.Tezos;

  const getQuipuSwapFaceIcon = () => (isHeadSelected ? QuipuSwapFaceActiveIcon : QuipuSwapFaceDefaultIcon);
  const getQuipuSwapBackIcon = () => (isTailSelected ? QuipuSwapBackActiveIcon : QuipuSwapBackDefaultIcon);

  const getTezosFaceIcon = () => (isHeadSelected ? TezosFaceActiveIcon : TezosFaceDefaultIcon);
  const getTezosBackIcon = () => (isTailSelected ? TezosBackActiveIcon : TezosBackDefaultIcon);

  const getFaceIcon = () => (isTez ? getTezosFaceIcon() : getQuipuSwapFaceIcon());
  const getBackIcon = () => (isTez ? getTezosBackIcon() : getQuipuSwapBackIcon());

  const handleSelectSideA = () => handleSelectCoinSide(CoinSide.Head);
  const handleSelectSideB = () => handleSelectCoinSide(CoinSide.Tail);

  const animationData = isTez ? animationTezosData : animationQuipuData;

  return {
    isLoading,
    error,
    animationData,
    handleSelectSideA,
    handleSelectSideB,
    FaceIcon: getFaceIcon(),
    BackIcon: getBackIcon()
  };
};
