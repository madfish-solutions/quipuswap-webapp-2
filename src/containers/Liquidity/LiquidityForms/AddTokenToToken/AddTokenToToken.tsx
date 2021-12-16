import React, { Dispatch, SetStateAction } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { Button } from '@quipuswap/ui-kit';

import { Plus } from '@components/svg/Plus';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { Nullable, WhitelistedToken } from '@utils/types';

import s from '../../Liquidity.module.sass';
import { useViewModel } from './useViewModel';

type AddTokenToTokenProps = {
  dex: FoundDex | null;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<Nullable<WhitelistedToken>>>;
  setTokenB: Dispatch<SetStateAction<Nullable<WhitelistedToken>>>;
  tokenABalance: string;
  tokenBBalance: string;
};

export const AddTokenToToken: React.FC<AddTokenToTokenProps> = ({
  dex,
  tokenA,
  tokenB,
  setTokenA,
  setTokenB,
  tokenABalance,
  tokenBBalance
}) => {
  const {
    accountPkh,
    tokenAInput,
    tokenBInput,
    handleTokenAInput,
    handleTokenBInput,
    handleTokenABalance,
    handleTokenBBalance,
    handleSetTokenA,
    handleSetTokenB,
    handleAddLiquidity
  } = useViewModel(dex, tokenA, tokenB, setTokenA, setTokenB);

  return (
    <>
      <TokenSelect
        label="Input"
        balance={tokenABalance}
        token={tokenA}
        setToken={handleSetTokenA}
        value={tokenAInput}
        onInput={handleTokenAInput}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={handleTokenABalance}
        noBalanceButtons={!accountPkh}
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Input"
        balance={tokenBBalance}
        token={tokenB}
        setToken={handleSetTokenB}
        value={tokenBInput}
        onInput={handleTokenBInput}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={handleTokenBBalance}
        noBalanceButtons={!accountPkh}
      />
      <Button className={s.button} onClick={handleAddLiquidity} disabled={!accountPkh}>
        Add
      </Button>
    </>
  );
};
