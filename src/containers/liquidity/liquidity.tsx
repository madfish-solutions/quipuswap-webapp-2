import React, { FC } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import { useTranslation } from 'next-i18next';

import { PageTitle } from '@components/common/page-title';
import { LiquidityCards } from '@containers/liquidity/liquidity-cards';
import { useLiquidityFormService } from '@containers/liquidity/liquidity-cards/use-liquidity-form.service';
import { DeadlineAndSlippageProvider } from '@utils/dapp/slippage-deadline';
import { getTokensOptionalPairName } from '@utils/helpers';

interface LiquidityProps {
  className?: string;
}

export const Liquidity: FC<LiquidityProps> = ({ className }) => {
  const { t } = useTranslation(['common']);

  const { tokenA, tokenB } = useLiquidityFormService();

  const title = `${t('common|Liquidity')} ${getTokensOptionalPairName(tokenA, tokenB)}`;

  return (
    <DeadlineAndSlippageProvider>
      <PageTitle>{title}</PageTitle>
      <StickyBlock className={className}>
        <LiquidityCards />
      </StickyBlock>
    </DeadlineAndSlippageProvider>
  );
};
