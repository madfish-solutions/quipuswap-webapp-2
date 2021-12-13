import React, { useState } from 'react';
import { StickyBlock } from '@quipuswap/ui-kit';
import { withTypes } from 'react-final-form';

import {
  LiquidityFormValues,
  TokenDataMap,
  WhitelistedTokenPair,
} from '@utils/types';
import { MAINNET_DEFAULT_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { fallbackTokenToTokenData } from '@utils/helpers';
import { LiquidityForm } from '@containers/Liquidity/LiquidityForms';

import { LiquidityChart } from './LiquidityChart';

type LiquidityProps = {
  className?: string
};

const fallbackTokenPair = {
  token1: TEZOS_TOKEN,
  token2: MAINNET_DEFAULT_TOKEN,
} as WhitelistedTokenPair;

export const Liquidity: React.FC<LiquidityProps> = ({
  className,
}) => {
  const { Form } = withTypes<LiquidityFormValues>();
  const [tokensData] = useState<TokenDataMap>({
    first: fallbackTokenToTokenData(TEZOS_TOKEN),
    second: fallbackTokenToTokenData(MAINNET_DEFAULT_TOKEN),
  });

  return (
    <>
      {
        // TODO: Implement it
        false && (
          <LiquidityChart token1={fallbackTokenPair.token1} token2={fallbackTokenPair.token2} />
        )
      }
      <StickyBlock className={className}>
        <Form
          onSubmit={() => {}}
          render={() => (
            <LiquidityForm tokensData={tokensData} />
          )}
        />

      </StickyBlock>
    </>
  );
};
