import React from 'react';

import { Plus, Button, Slippage, ArrowDown } from '@quipuswap/ui-kit';

import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { noOpFunc } from '@utils/helpers';

import s from '../../Liquidity.module.sass';
import { AddRemoveFormInterface } from '../AddRemoveForm.props';
import { useRemoveTezToTokenService } from './useRemoveTezToTokenService';

export const RemoveTezToToken: React.FC<AddRemoveFormInterface> = ({
  tokenA,
  tokenB,
  onTokenAChange,
  onTokenBChange
}) => {
  const {
    accountPkh,
    tokenAOutput,
    tokenBOutput,
    lpTokenInput,
    tokenABalance,
    tokenBBalance,
    lpTokenBalance,
    handleLpTokenChange,
    handleSlippageChange,
    handleBalance,
    handleRemoveLiquidity
  } = useRemoveTezToTokenService(tokenA, tokenB);

  return (
    <>
      <TokenSelect
        label="Select LP"
        balance={lpTokenBalance}
        token={tokenA}
        token2={tokenB}
        setToken={onTokenBChange}
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
        setToken={onTokenAChange}
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
        setToken={onTokenBChange}
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
