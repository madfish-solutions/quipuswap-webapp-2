import { useTokenBalance } from '@shared/hooks';

import { useCoinflipStore } from '../../hooks';
import { CoinSide } from '../../stores';

export const useCoinflipGameViewModel = () => {
  const coinflipStore = useCoinflipStore();
  const { tokenToPlay, game, token } = coinflipStore;

  const tokenBalance = useTokenBalance(token);

  const handleSelectCoinSide = (coinSide: CoinSide) => {
    coinflipStore.setCoinSide(coinSide);
  };

  const handleAmountInputChange = (amountInput: string) => {
    coinflipStore.setInput(amountInput);
  };

  const handleFormSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('submit');
  };

  return {
    tokenToPlay,
    tokenBalance: tokenBalance ?? null,
    game,
    token,
    handleSelectCoinSide,
    handleAmountInputChange,
    handleFormSubmit
  };
};
