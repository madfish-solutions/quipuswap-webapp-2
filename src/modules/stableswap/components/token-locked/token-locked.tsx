import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { DetailsCardCell, StateCurrencyAmount } from '@shared/components';

import { useTokenLockedViewModel } from './use-token-locked.vm';

interface Props {
  className: string;
  tokenSymbol: Nullable<string>;
  amount: Nullable<BigNumber>;
  isLoading: boolean;
  dollarEquivalent: Nullable<BigNumber>;
}

export const TokenLocked: FC<Props> = ({ className, amount, isLoading, tokenSymbol, dollarEquivalent }) => {
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
