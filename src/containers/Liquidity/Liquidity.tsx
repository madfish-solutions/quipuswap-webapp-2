import React from 'react';
import { StickyBlock } from '@quipuswap/ui-kit';
import { withTypes } from 'react-final-form';

import {
  LiquidityFormValues,
  WhitelistedTokenPair,
} from '@utils/types';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { LiquidityForm } from '@containers/Liquidity/LiquidityForms';

import { LiquidityChart } from './LiquidityChart';

type LiquidityProps = {
  className?: string
};

const fallbackTokenPair = {
  token1: TEZOS_TOKEN,
  token2: STABLE_TOKEN,
} as WhitelistedTokenPair;

export const Liquidity: React.FC<LiquidityProps> = ({
  className,
}) => {
  const { Form } = withTypes<LiquidityFormValues>();

  return (
    <>
      <LiquidityChart token1={fallbackTokenPair.token1} token2={fallbackTokenPair.token2} />
      <StickyBlock className={className}>
        <Form
          onSubmit={() => {}}
          render={() => (
            <LiquidityForm />
          )}
        />

      </StickyBlock>
    </>
  );
};
