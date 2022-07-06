import BigNumber from 'bignumber.js';

import { useTokenBalance } from '@shared/hooks';

import { useCoinflipStore } from '../../hooks';
import { CoinSide } from '../../stores';

export const useCoinflipGameViewModel = () => {
  const coinflipStore = useCoinflipStore();
  const { tokenToPlay, game, token, payout } = coinflipStore;

  const tokenBalance = useTokenBalance(token) ?? null;

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('submit', { ...game });
    // TODO
    // flipApi();
  };

  const handleSelectCoinSide = (coinSide: Nullable<CoinSide>) => {
    coinflipStore.setCoinSide(coinSide);
  };

  const handleAmountInputChange = (amountInput: string) => {
    const input = new BigNumber(amountInput);
    coinflipStore.setInput(!input.isNaN() ? input : null);
  };

  return {
    tokenToPlay,
    tokenBalance,
    game,
    token,
    payout,
    handleSelectCoinSide,
    handleAmountInputChange,
    handleFormSubmit: handleSubmit
  };
};
