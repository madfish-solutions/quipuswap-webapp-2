import React from 'react';

import { Button } from '@quipuswap/ui-kit';

import { Plus } from '@components/svg/Plus';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';

import s from '../../Liquidity.module.sass';
import { AddRemoveFormInterface } from '../AddRemoveForm.props';
import { useAddTokenToTokenService } from './useAddTokenToTokenService';

export const AddTokenToToken: React.FC<AddRemoveFormInterface> = ({ tokenA, tokenB, setTokenA, setTokenB }) => {
  const {
    accountPkh,
    tokenAInput,
    tokenBInput,
    tokenABalance,
    tokenBBalance,
    handleTokenAInput,
    handleTokenBInput,
    handleTokenABalance,
    handleTokenBBalance,
    handleSetTokenA,
    handleSetTokenB,
    handleAddLiquidity
  } = useAddTokenToTokenService(tokenA, tokenB, setTokenA, setTokenB);

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
