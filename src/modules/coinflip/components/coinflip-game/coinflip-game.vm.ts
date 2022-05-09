import { useCoinflipStore } from '../../hooks';
import { CoinSide } from '../../stores';

export const useCoinflipGameViewModel = () => {
  const coinflipStore = useCoinflipStore();
  const { tokenToPlay, tokenBalance, game, token } = coinflipStore;

  const handleSelectCoinSide = (coinSide: CoinSide) => {
    coinflipStore.setCoinSide(coinSide);
  };

  const handleFormSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('submit');
  };

  return { tokenToPlay, tokenBalance, game, token, handleSelectCoinSide, handleFormSubmit };
};
