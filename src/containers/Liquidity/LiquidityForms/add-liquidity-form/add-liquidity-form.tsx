import React, { FC } from 'react';

import { Button } from '@quipuswap/ui-kit';

import { Plus } from '@components/svg/Plus';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { useAddLiquidityService } from '@containers/Liquidity/LiquidityForms/add-liquidity-form/use-add-liqudity-service';
import { fromDecimals } from '@utils/helpers';

import s from '../../Liquidity.module.sass';
import { AddFormInterface } from './add-form.props';

export const AddLiquidityForm: FC<AddFormInterface> = ({ dex, tokenA, tokenB, onTokenAChange, onTokenBChange }) => {
  const {
    errorMessageTokenA,
    errorMessageTokenB,
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
  } = useAddLiquidityService(dex, tokenA, tokenB, onTokenAChange, onTokenBChange);

  const { decimals: decimalsA } = tokenA.metadata;
  const { decimals: decimalsB } = tokenB.metadata;

  const isButtonDisabled =
    !accountPkh || Boolean(errorMessageTokenA) || Boolean(errorMessageTokenB) || !tokenAInput || !tokenBInput;

  return (
    <>
      <TokenSelect
        label="Input"
        balance={fromDecimals(tokenABalance, decimalsA).toFixed(decimalsA)}
        token={tokenA}
        setToken={handleSetTokenA}
        value={tokenAInput}
        onChange={handleTokenAChange}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={handleTokenABalance}
        noBalanceButtons={!accountPkh}
        error={accountPkh ? errorMessageTokenA : undefined}
        placeholder="0.0"
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Input"
        balance={fromDecimals(tokenBBalance, decimalsB).toFixed(decimalsB)}
        token={tokenB}
        setToken={handleSetTokenB}
        value={tokenBInput}
        onChange={handleTokenBChange}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={handleTokenBBalance}
        noBalanceButtons={!accountPkh}
        error={accountPkh ? errorMessageTokenB : undefined}
        placeholder="0.0"
      />
      <Button className={s.button} onClick={handleAddLiquidity} disabled={isButtonDisabled}>
        Add
      </Button>
    </>
  );
};
