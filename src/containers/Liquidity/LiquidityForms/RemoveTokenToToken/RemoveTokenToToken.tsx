import React, { Dispatch, SetStateAction } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { Plus, Button, ArrowDown } from '@quipuswap/ui-kit';

import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { noOpFunc } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

import s from '../../Liquidity.module.sass';
import { useViewModel } from './useViewModel';

type RemoveTokenToTokenProps = {
  dex: Nullable<FoundDex>;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<Nullable<WhitelistedToken>>>;
  setTokenB: Dispatch<SetStateAction<Nullable<WhitelistedToken>>>;
  tokenABalance: string;
  tokenBBalance: string;
  lpTokenBalance: string;
};

export const RemoveTokenToToken: React.FC<RemoveTokenToTokenProps> = ({
  dex,
  tokenA,
  tokenB,
  setTokenA,
  setTokenB,
  tokenABalance,
  tokenBBalance,
  lpTokenBalance
}) => {
  const { accountPkh, lpTokenInput, tokenAOutput, tokenBOutput, handleRemoveLiquidity, handleChange, handleBalance } =
    useViewModel(dex, tokenA, tokenB);

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
