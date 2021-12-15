import React, { Dispatch, SetStateAction } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { Plus, Button, Slippage, ArrowDown } from '@quipuswap/ui-kit';

import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { noOpFunc } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

import s from '../../Liquidity.module.sass';
import { useViewModel } from './useViewModel';

type RemoveTezToTokenProps = {
  dex: Nullable<FoundDex>;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<Nullable<WhitelistedToken>>>;
  setTokenB: Dispatch<SetStateAction<Nullable<WhitelistedToken>>>;
  tokenABalance: string;
  tokenBBalance: string;
  lpTokenBalance: string;
};

export const RemoveTezToToken: React.FC<RemoveTezToTokenProps> = ({
  dex,
  tokenA,
  tokenB,
  setTokenA,
  setTokenB,
  tokenABalance,
  tokenBBalance,
  lpTokenBalance
}) => {
  const {
    accountPkh,
    tokenAOutput,
    tokenBOutput,
    lpTokenInput,
    handleLpTokenChange,
    handleSlippageChange,
    handleBalance,
    handleRemoveLiquidity
  } = useViewModel(dex, tokenA, tokenB);

  return (
    <>
      <TokenSelect
        label="Select LP"
        balance={lpTokenBalance}
        token={tokenA}
        token2={tokenB}
        setToken={setTokenB}
        value={lpTokenInput}
        onChange={handleLpTokenChange}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={handleBalance}
      />
      <ArrowDown className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={tokenABalance}
        token={tokenA}
        setToken={setTokenA}
        value={tokenAOutput}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={noOpFunc}
        noBalanceButtons
        notSelectable
        disabled
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={tokenBBalance}
        token={tokenB}
        setToken={setTokenB}
        value={tokenBOutput}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={noOpFunc}
        noBalanceButtons
        notSelectable
        disabled
      />
      <Slippage handleChange={handleSlippageChange} />
      <Button className={s.button} onClick={handleRemoveLiquidity} disabled={!accountPkh}>
        Remove
      </Button>
    </>
  );
};
