import React, { useMemo } from 'react';
import { Field } from 'react-final-form';
import { FoundDex } from '@quipuswap/sdk';

import { LiquidityFormValues, WhitelistedToken } from '@utils/types';
import { getWhitelistedTokenSymbol } from '@utils/helpers';

import { LiquiditySlippageField } from './LiquiditySlippageField';
import { LiquidityRebalance } from './LiquidityRebalance';
import { LiquidityRemoveConfirm } from './LiquidityRemoveConfirm';

interface LiquiditySlippageProps {
  dex?: FoundDex;
  handleRemoveLiquidity: () => void;
  values: LiquidityFormValues;
  tab: 'remove' | 'add';
  token1: WhitelistedToken;
  token2: WhitelistedToken;
}

export const LiquiditySlippage: React.FC<LiquiditySlippageProps> = ({
  dex,
  values,
  token1,
  token2,
  tab,
  handleRemoveLiquidity,
}) => {
  const tokenAName = useMemo(
    () => (token1 ? getWhitelistedTokenSymbol(token1) : 'Token A'),
    [token1],
  );
  const tokenBName = useMemo(
    () => (token2 ? getWhitelistedTokenSymbol(token2) : 'Token B'),
    [token2],
  );
  return (
    <Field initialValue="0.5 %" name="slippage">
      {({ input }) => (
        <>
          <LiquiditySlippageField
            rebalanceSwitcher={values.rebalanceSwitcher}
            tab={tab}
            input={input}
          />
          <LiquidityRebalance
            rebalanceSwitcher={values.rebalanceSwitcher}
            tab={tab}
            dex={dex}
            values={values}
            token2={token2}
            tokenAName={tokenAName}
            tokenBName={tokenBName}
          />
          <LiquidityRemoveConfirm
            handleRemoveLiquidity={handleRemoveLiquidity}
            tab={tab}
            values={values}
            tokenAName={tokenAName}
            tokenBName={tokenBName}
          />
        </>
      )}
    </Field>
  );
};
