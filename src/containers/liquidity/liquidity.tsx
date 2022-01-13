import React, { FC } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';

import { LiquidityCards } from '@containers/liquidity/liquidity-cards';

interface LiquidityProps {
  className?: string;
}

export const Liquidity: FC<LiquidityProps> = ({ className }) => (
  <StickyBlock className={className}>
    <LiquidityCards />
  </StickyBlock>
);
