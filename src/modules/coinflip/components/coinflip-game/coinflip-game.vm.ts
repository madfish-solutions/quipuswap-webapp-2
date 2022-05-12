import { useTokenBalance } from '@shared/hooks';

import { useCoinflipStore } from '../../hooks';
import { CoinSide } from '../../stores';

export const useCoinflipGameViewModel = () => {
  const coinflipStore = useCoinflipStore();
  const { tokenToPlay, game, token } = coinflipStore;

  const tokenBalance = useTokenBalance(token) ?? null;

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('submit');
  };

  const handleSelectCoinSide = (coinSide: CoinSide) => {
    coinflipStore.setCoinSide(coinSide);
  };

  const handleAmountInputChange = (amountInput: string) => {
    coinflipStore.setInput(amountInput);
  };

  return {
    tokenToPlay,
    tokenBalance,
    game,
    token,
    handleSelectCoinSide,
    handleAmountInputChange,
    handleFormSubmit: handleSubmit
  };
};
