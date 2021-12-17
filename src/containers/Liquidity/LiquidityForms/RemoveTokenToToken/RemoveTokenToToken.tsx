import React from 'react';

import { Plus, Button, ArrowDown } from '@quipuswap/ui-kit';

import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { noOpFunc } from '@utils/helpers';

import s from '../../Liquidity.module.sass';
import { AddRemoveFormInterface } from '../AddRemoveForm.props';
import { useRemoveTokenToTokenService } from './useRemoveTokenToTokenService';

export const RemoveTokenToToken: React.FC<AddRemoveFormInterface> = ({ tokenA, tokenB, setTokenA, setTokenB }) => {
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
        setToken={setTokenB}
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
        setToken={setTokenA}
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
        setToken={setTokenB}
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
