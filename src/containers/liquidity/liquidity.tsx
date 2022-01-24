import React, { FC } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import { useTranslation } from 'next-i18next';

import { PageTitle } from '@components/common/page-title';

import { LiquidityCards } from './liquidity-cards';

interface LiquidityProps {
  className?: string;
}

export const Liquidity: FC<LiquidityProps> = ({ className }) => {
  const { t } = useTranslation(['common']);

  return (
    <>
      <PageTitle>{t('common|Liquidity')}</PageTitle>
      <StickyBlock className={className}>
        <LiquidityCards />
      </StickyBlock>
    </>
  );
};
