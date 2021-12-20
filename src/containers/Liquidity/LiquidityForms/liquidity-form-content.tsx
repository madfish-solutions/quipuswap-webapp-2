import { FC } from 'react';

import { ErrorAlert } from '@components/common/ErrorAlert';
import { AddLiquidityForm } from '@containers/Liquidity/LiquidityForms/add-liquidity-form';
import { RemoveLiquidityForm } from '@containers/Liquidity/LiquidityForms/remove-liquidity-form';
import { useLiquidityFormContent } from '@containers/Liquidity/LiquidityForms/use-liquidity-form-content';

interface Props {
  tab: string;
}

export const LiquidityFormContent: FC<Props> = ({ tab }) => {
  const { tokenA, tokenB, handleChangeTokenA, handleChangeTokenB, handleChangeTokensPair } = useLiquidityFormContent();

  if (!tokenA || !tokenB) {
    return <ErrorAlert error={new Error('Tokens should be defined')} />;
  }

  if (tab === 'add') {
    return (
      <AddLiquidityForm
        tokenA={tokenA}
        tokenB={tokenB}
        onTokenAChange={handleChangeTokenA}
        onTokenBChange={handleChangeTokenB}
      />
    );
  }

  return <RemoveLiquidityForm tokenA={tokenA} tokenB={tokenB} onChangeTokensPair={handleChangeTokensPair} />;
};
