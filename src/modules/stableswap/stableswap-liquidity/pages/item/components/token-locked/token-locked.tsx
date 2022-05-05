import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { DetailsCardCell, StateCurrencyAmount } from '@shared/components';
import { useTranslation } from '@translation';

export interface TokenLockedProps {
  className: string;
  tokenSymbol: string;
  amount: BigNumber;
  isLoading: boolean;
}

export const TokenLocked: FC<TokenLockedProps> = ({ className, amount, isLoading, tokenSymbol }) => {
  const { t } = useTranslation();

  return (
    <DetailsCardCell cellName={t('stableswap|Token {{tokenSymbol}} locked', { tokenSymbol })} className={className}>
      <StateCurrencyAmount isLoading={isLoading} currency={tokenSymbol} amount={amount} />
    </DetailsCardCell>
  );
};
