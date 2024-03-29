import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { DetailsCardCell, StateCurrencyAmount } from '@shared/components';
import { Nullable } from '@shared/types';

import { useTokenLockedViewModel } from './use-token-locked.vm';

interface Props {
  className: string;
  tooltipContent?: string;
  tokenSymbol: Nullable<string>;
  amount: Nullable<BigNumber>;
  isLoading: boolean;
  dollarEquivalent: Nullable<BigNumber>;
}

export const TokenLocked: FC<Props> = ({
  className,
  tooltipContent,
  amount,
  isLoading,
  tokenSymbol,
  dollarEquivalent
}) => {
  const cellName = useTokenLockedViewModel(tokenSymbol);

  return (
    <DetailsCardCell
      cellName={cellName}
      tooltipContent={tooltipContent}
      className={className}
      data-test-id="tokenLocked"
    >
      <StateCurrencyAmount
        isLoading={isLoading}
        currency={tokenSymbol}
        amount={amount}
        dollarEquivalent={dollarEquivalent}
      />
    </DetailsCardCell>
  );
};
