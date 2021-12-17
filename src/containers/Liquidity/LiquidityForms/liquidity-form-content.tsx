import { FC } from 'react';

import { ErrorAlert } from '@components/common/ErrorAlert';
import { AddTezToToken } from '@containers/Liquidity/LiquidityForms/AddTezToToken';
import { AddTokenToToken } from '@containers/Liquidity/LiquidityForms/AddTokenToToken';
import { RemoveTezToToken } from '@containers/Liquidity/LiquidityForms/RemoveLiquidityForms/RemoveTezToToken';
import { RemoveTokenToToken } from '@containers/Liquidity/LiquidityForms/RemoveLiquidityForms/RemoveTokenToToken';
import { useLiquidityFormContent } from '@containers/Liquidity/LiquidityForms/use-liquidity-form-content';

interface Props {
  tab: string;
}

export const LiquidityFormContent: FC<Props> = ({ tab }) => {
  const {
    dexInfo,
    tokenA,
    tokenB,
    handleChangeTokenA,
    handleChangeTokenB,
    tokenABalance,
    tokenBBalance,
    lpTokenBalance,
    handleChangeTokensPair
  } = useLiquidityFormContent();

  if (!tokenA || !tokenB) {
    return <ErrorAlert error={new Error('Tokens should be defined')} />;
  }

  if (tab === 'add') {
    return dexInfo.isTezosToTokenDex ? (
      <AddTezToToken
        tokenA={tokenA}
        tokenB={tokenB}
        onTokenAChange={handleChangeTokenA}
        onTokenBChange={handleChangeTokenB}
      />
    ) : (
      <AddTokenToToken
        tokenA={tokenA}
        tokenB={tokenB}
        onTokenAChange={handleChangeTokenA}
        onTokenBChange={handleChangeTokenB}
      />
    );
  }

  return dexInfo.isTezosToTokenDex ? (
    <RemoveTezToToken
      dex={dexInfo.dex}
      tokenA={tokenA}
      tokenB={tokenB}
      tokenABalance={tokenABalance}
      tokenBBalance={tokenBBalance}
      lpTokenBalance={lpTokenBalance}
      onChangeTokensPair={handleChangeTokensPair}
    />
  ) : (
    <RemoveTokenToToken
      dex={dexInfo.dex}
      tokenA={tokenA}
      tokenB={tokenB}
      tokenABalance={tokenABalance}
      tokenBBalance={tokenBBalance}
      lpTokenBalance={lpTokenBalance}
      onChangeTokensPair={handleChangeTokensPair}
    />
  );
};
