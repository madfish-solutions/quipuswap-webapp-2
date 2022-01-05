import React, { FC } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';

import { LiquidityForm } from '@containers/Liquidity/LiquidityForms';

interface LiquidityProps {
  className?: string;
}

export const Liquidity: FC<LiquidityProps> = ({ className }) => {
  return (
    <>
      <StickyBlock className={className}>
        <LiquidityForm />
      </StickyBlock>
    </>
  );
};
