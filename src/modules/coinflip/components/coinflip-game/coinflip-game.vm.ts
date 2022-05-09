import { useCoinflipStore } from '../../hooks';
import { CoinSide } from '../../stores';

export const useCoinflipGameViewModel = () => {
  const coinflipStore = useCoinflipStore();
  const { tokenToPlay, tokenBalance, game } = coinflipStore;

  const handleSelectCoinSide = (coinSide: CoinSide) => {
    coinflipStore.setCoinSide(coinSide);
  };

  return { tokenToPlay, tokenBalance, game, handleSelectCoinSide };
};
