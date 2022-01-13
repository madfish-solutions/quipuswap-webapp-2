import React, { FC } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';

import { ErrorAlert } from '@components/common/ErrorAlert';
import { Skeleton } from '@components/common/Skeleton';
import { StateWrapper } from '@components/state-wrapper';
import { LiquidityForm } from '@containers/Liquidity/LiquidityForms';
import { SomethingWentWrongError } from '@errors/SomethingWentWrongError.error';

import { useLiquidityFormService } from './LiquidityForms/use-liquidity-form.service';

interface LiquidityProps {
  className?: string;
}

export const Liquidity: FC<LiquidityProps> = ({ className }) => {
  const { dex, tokenA, tokenB } = useLiquidityFormService();
  const isLoading = !dex;
  const isError = !tokenA || !tokenB;

  return (
    <>
      <StickyBlock className={className}>
        <StateWrapper
          isLoading={isLoading}
          loaderFallback={<Skeleton width={502} height={515} />}
          isError={isError}
          errorFallback={<ErrorAlert error={new SomethingWentWrongError()} />}
        >
          <LiquidityForm />
        </StateWrapper>
      </StickyBlock>
    </>
  );
};
