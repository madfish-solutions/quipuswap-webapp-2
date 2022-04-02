import { FC, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { PageTitle, StickyBlock } from '@shared/components';
import { DeadlineAndSlippageProvider } from '@shared/dapp';
import { getTokensOptionalPairName } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

import { LiquidityCards } from './liquidity-cards';

interface LiquidityProps {
  className?: string;
}

export const Liquidity: FC<LiquidityProps> = ({ className }) => {
  const { t } = useTranslation(['common']);

  const getTitle = (token1: Nullable<Token>, token2: Nullable<Token>) => getTokensOptionalPairName(token1, token2);

  const [title, setTitle] = useState('');

  const handleTokensChange = (token1: Nullable<Token>, token2: Nullable<Token>) => {
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
