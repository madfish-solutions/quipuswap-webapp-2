import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { DetailsCardCell, StateCurrencyAmount } from '@shared/components';

import { useTokenLockedViewModel } from './use-token-locked.vm';

export interface TokenLockedProps {
  className: string;
  tokenSymbol: string;
  amount: BigNumber;
  isLoading: boolean;
  dollarEquivalent: BigNumber;
}

export const TokenLocked: FC<TokenLockedProps> = ({ className, amount, isLoading, tokenSymbol, dollarEquivalent }) => {
  const cellName = useTokenLockedViewModel(tokenSymbol);

  return (
    <DetailsCardCell cellName={cellName} className={className}>
      <StateCurrencyAmount
        isLoading={isLoading}
        currency={tokenSymbol}
        amount={amount}
        dollarEquivalent={dollarEquivalent}
      />
    </DetailsCardCell>
  );
};
