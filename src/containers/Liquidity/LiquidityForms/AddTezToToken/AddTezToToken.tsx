import React, { FC } from 'react';

import { Button } from '@quipuswap/ui-kit';

import { Plus } from '@components/svg/Plus';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';

import s from '../../Liquidity.module.sass';
import { AddRemoveFormInterface } from '../AddRemoveForm.props';
import { useAddTezToTokenService } from './useAddTezToTokenService';

export const AddTezToToken: FC<AddRemoveFormInterface> = ({ tokenA, tokenB, onTokenAChange, onTokenBChange }) => {
  const {
    accountPkh,
    tokenAInput,
    tokenBInput,
    tokenABalance,
    tokenBBalance,
    handleSetTokenA,
    handleSetTokenB,
    handleTokenABalance,
    handleTokenAChange,
    handleTokenBChange,
    handleTokenBBalance,
    handleAddLiquidity
  } = useAddTezToTokenService(tokenA, tokenB, onTokenAChange, onTokenBChange);

  return (
    <>
      <TokenSelect
        label="Input"
        balance={tokenABalance}
        token={tokenA}
        setToken={handleSetTokenA}
        value={tokenAInput}
        onChange={handleTokenAChange}
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
        onChange={handleTokenBChange}
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
