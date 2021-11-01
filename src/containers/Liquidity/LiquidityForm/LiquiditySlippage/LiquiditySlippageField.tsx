import React from 'react';

import { ICurrentTab } from '@utils/types';
import { Slippage } from '@components/common/Slippage';

export const LiquiditySlippageField: React.FC<{
  rebalanceSwitcher: boolean;
  input: any;
  currentTab: ICurrentTab;
}> = ({ rebalanceSwitcher, input, currentTab }) => {
  if (currentTab.id === 'remove' || rebalanceSwitcher) {
    return <Slippage handleChange={(value) => input.onChange(value)} />;
  }
  return null;
};
