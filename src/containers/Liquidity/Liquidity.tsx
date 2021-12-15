import React from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import { withTypes } from 'react-final-form';
import { noop } from 'rxjs';

import { LiquidityForm } from '@containers/Liquidity/LiquidityForms';
import { LiquidityFormValues } from '@utils/types';

interface LiquidityProps {
  className?: string;
}

export const Liquidity: React.FC<LiquidityProps> = ({ className }) => {
  const { Form } = withTypes<LiquidityFormValues>();

  return (
    <>
      <StickyBlock className={className}>
        <Form onSubmit={noop} render={() => <LiquidityForm />} />
      </StickyBlock>
    </>
  );
};
