import React from 'react';

import { Plus, Button, ArrowDown } from '@quipuswap/ui-kit';

import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { noOpFunc } from '@utils/helpers';

import s from '../../Liquidity.module.sass';
import { AddRemoveFormInterface } from '../AddRemoveForm.props';
import { useRemoveTokenToTokenService } from './useRemoveTokenToTokenService';

export const RemoveTokenToToken: React.FC<AddRemoveFormInterface> = ({
  tokenA,
  tokenB,
  onTokenAChange,
  onTokenBChange
}) => {
  const {
    accountPkh,
    lpTokenInput,
    tokenAOutput,
    tokenBOutput,
    tokenABalance,
    tokenBBalance,
    lpTokenBalance,
    handleRemoveLiquidity,
    handleChange,
    handleBalance
  } = useRemoveTokenToTokenService(tokenA, tokenB);

  return (
    <>
      <TokenSelect
        label="Select LP"
        balance={lpTokenBalance}
        token={tokenA}
        token2={tokenB}
        setToken={onTokenBChange}
        value={lpTokenInput}
        onChange={handleChange}
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
        disabled
        notSelectable
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
        disabled
        notSelectable
      />
      <Button className={s.button} onClick={handleRemoveLiquidity} disabled={!accountPkh}>
        Remove
      </Button>
    </>
  );
};
