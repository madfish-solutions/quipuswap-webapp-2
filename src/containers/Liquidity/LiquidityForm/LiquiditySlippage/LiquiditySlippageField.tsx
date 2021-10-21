import React from 'react';

import {Slippage} from '@components/common/Slippage';

export const LiquiditySlippageField: React.FC<{
  rebalanceSwitcher: boolean;
  input: any;
  tab: 'remove' | 'add';
}> = ({rebalanceSwitcher, input, tab}) => {
  if (tab === 'remove' || rebalanceSwitcher) {
    return <Slippage handleChange={(value) => input.onChange(value)} />;
  }
  return null;
};
