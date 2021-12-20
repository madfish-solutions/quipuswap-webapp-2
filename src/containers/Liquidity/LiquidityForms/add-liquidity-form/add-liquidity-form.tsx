import React, { FC } from 'react';

import { Button } from '@quipuswap/ui-kit';

import { Plus } from '@components/svg/Plus';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { useAddLiqudityService } from '@containers/Liquidity/LiquidityForms/add-liquidity-form/use-add-liqudity-service';

import s from '../../Liquidity.module.sass';
import { AddFormInterface } from './add-form.props';

export const AddLiquidityForm: FC<AddFormInterface> = ({ tokenA, tokenB, onTokenAChange, onTokenBChange }) => {
  const {
    accountPkh,
    tokenABalance,
    tokenBBalance,
    tokenAInput,
    tokenBInput,
    handleSetTokenA,
    handleSetTokenB,
    handleTokenAChange,
    handleTokenBChange,
    handleTokenABalance,
    handleTokenBBalance,
    handleAddLiquidity
  } = useAddLiqudityService(tokenA, tokenB, onTokenAChange, onTokenBChange);

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
