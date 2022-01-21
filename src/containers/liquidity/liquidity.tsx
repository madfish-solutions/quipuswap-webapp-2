import React, { FC } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';

import { LiquidityCards } from '@containers/liquidity/liquidity-cards';
import { DeadlineAndSlippageProvider } from '@utils/dapp/slippage-deadline';

interface LiquidityProps {
  className?: string;
}

export const Liquidity: FC<LiquidityProps> = ({ className }) => (
  <DeadlineAndSlippageProvider>
    <StickyBlock className={className}>
      <LiquidityCards />
    </StickyBlock>
  </DeadlineAndSlippageProvider>
);
