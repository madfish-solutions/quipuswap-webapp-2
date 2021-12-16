import React, { FC } from 'react';

import { ErrorAlert } from '@components/common/ErrorAlert';
import { AddTezToToken } from '@containers/Liquidity/LiquidityForms/AddTezToToken';
import { AddTokenToToken } from '@containers/Liquidity/LiquidityForms/AddTokenToToken';
import { RemoveTezToToken } from '@containers/Liquidity/LiquidityForms/RemoveLiquidityForms/RemoveTezToToken';
import { RemoveTokenToToken } from '@containers/Liquidity/LiquidityForms/RemoveLiquidityForms/RemoveTokenToToken';
import { useViewModel } from '@containers/Liquidity/LiquidityForms/useViewModel';

interface Props {
  tab: string;
}

export const LiquidityFormContent: FC<Props> = ({ tab }) => {
  const {
    dexInfo,
    tokenA,
    tokenB,
    setTokenA,
    setTokenB,
    tokenABalance,
    tokenBBalance,
    lpTokenBalance,
    handleChangeTokensPair
  } = useViewModel();

  if (!tokenA || !tokenB) {
    return <ErrorAlert error={new Error('Tokens should be defined')} />;
  }

  if (tab === 'add') {
    return dexInfo.isTezosToTokenDex ? (
      <AddTezToToken
        dex={dexInfo.dex}
        tokenA={tokenA}
        tokenB={tokenB}
        setTokenA={setTokenA}
        setTokenB={setTokenB}
        tokenABalance={tokenABalance}
        tokenBBalance={tokenBBalance}
      />
    ) : (
      <AddTokenToToken
        dex={dexInfo.dex}
        tokenA={tokenA}
        tokenB={tokenB}
        setTokenA={setTokenA}
        setTokenB={setTokenB}
        tokenABalance={tokenABalance}
        tokenBBalance={tokenBBalance}
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
