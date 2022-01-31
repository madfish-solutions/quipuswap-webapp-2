import React, { FC, useState } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import { useTranslation } from 'next-i18next';

import { PageTitle } from '@components/common/page-title';
import { LiquidityCards } from '@containers/liquidity/liquidity-cards';
import { DeadlineAndSlippageProvider } from '@utils/dapp/slippage-deadline';
import { getTokensOptionalPairName } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

interface LiquidityProps {
  className?: string;
}

export const Liquidity: FC<LiquidityProps> = ({ className }) => {
  const { t } = useTranslation(['common']);

  const getTitle = (token1: Nullable<WhitelistedToken>, token2: Nullable<WhitelistedToken>) =>
    getTokensOptionalPairName(token1, token2);

  const [title, setTitle] = useState('');

  const handleTokensChange = (token1: Nullable<WhitelistedToken>, token2: Nullable<WhitelistedToken>) => {
    setTitle(getTitle(token1, token2));
  };

  return (
    <DeadlineAndSlippageProvider>
      <PageTitle>
        {t('common|Liquidity')} {title}
      </PageTitle>
      <StickyBlock className={className}>
        <LiquidityCards onTokensChange={handleTokensChange} />
      </StickyBlock>
    </DeadlineAndSlippageProvider>
  );
};
