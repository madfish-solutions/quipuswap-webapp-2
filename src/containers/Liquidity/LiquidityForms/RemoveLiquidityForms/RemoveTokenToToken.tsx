import React, { ChangeEvent, useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { ArrowDown, Button, Plus } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { noop } from 'rxjs';

import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { usePairData } from '@containers/Liquidity/LiquidityForms/RemoveLiquidityForms/use-pair-data';
import { useRemoveLiquidity } from '@containers/Liquidity/LiquidityForms/RemoveLiquidityForms/use-remove-liquidity';
import { useAccountPkh } from '@utils/dapp';
import { fromDecimals } from '@utils/helpers';
import { Nullable, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import s from '../../Liquidity.module.sass';
import { sortTokensContracts } from '../../liquidutyHelpers';

interface RemoveTokenToTokenProps {
  dex: FoundDex | null;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  tokenABalance: string;
  tokenBBalance: string;
  lpTokenBalance: string;
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void;
}

export const RemoveTokenToToken: React.FC<RemoveTokenToTokenProps> = ({
  dex,
  tokenA,
  tokenB,
  tokenABalance,
  tokenBBalance,
  lpTokenBalance,
  onChangeTokensPair
}) => {
  const { t } = useTranslation(['common', 'liquidity']);
  const accountPkh = useAccountPkh();

  const [lpTokenInput, setLpTokenInput] = useState('');
  const [tokenAOutput, setTokenAOutput] = useState('');
  const [tokenBOutput, setTokenBOutput] = useState('');

  const { pairId, pairData } = usePairData({ dex, tokenA, tokenB });
  const { handleSubmitRemoveLiquidity } = useRemoveLiquidity();

  useEffect(() => {
    if (!dex || !pairData) {
      return;
    }
    if (lpTokenInput === '') {
      setTokenAOutput('');
      setTokenBOutput('');

      return;
    }
    const addresses = sortTokensContracts(tokenA, tokenB);
    if (!addresses) {
      return;
    }

    const tokenAPerOneLp =
      addresses.addressA === tokenA.contractAddress
        ? pairData.tokenAPool.dividedBy(pairData.totalSupply)
        : pairData.tokenBPool.dividedBy(pairData.totalSupply);
    const tokenBPerOneLp =
      addresses.addressB === tokenB.contractAddress
        ? pairData.tokenBPool.dividedBy(pairData.totalSupply)
        : pairData.tokenAPool.dividedBy(pairData.totalSupply);

    const lpInputWithDecimals = new BigNumber(10).pow(6).multipliedBy(lpTokenInput);

    const tokenAOut = tokenAPerOneLp.multipliedBy(lpInputWithDecimals);
    const tokenBOut = tokenBPerOneLp.multipliedBy(lpInputWithDecimals);

    setTokenAOutput(fromDecimals(tokenAOut, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
    setTokenBOutput(fromDecimals(tokenBOut, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
    // Ignore tokenA & tokenB
    // eslint-disable-next-line
  }, [lpTokenInput, dex, pairData]);

  const [tokenPair, setTokenPair] = useState<Nullable<WhitelistedTokenPair>>(null);

  useEffect(() => {
    if (!dex) {
      return;
    }
    setTokenPair({
      token1: tokenA,
      token2: tokenB,
      dex
    });
  }, [dex, tokenA, tokenB]);

  const handleBalance = (balance: string) => {
    setLpTokenInput(new BigNumber(balance).toFixed());
  };

  const handleSetTokenPair = (tokensPair: WhitelistedTokenPair) => {
    onChangeTokensPair(tokensPair);
  };

  return (
    <>
      <PositionSelect
        label="Select LP"
        tokenPair={tokenPair}
        setTokenPair={handleSetTokenPair}
        balance={lpTokenBalance}
        handleBalance={handleBalance}
        noBalanceButtons={!accountPkh}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setLpTokenInput(event.target.value)}
        balanceLabel={t('vote|Available balance')}
        notFrozen
        id="liquidity-remove-input"
        className={s.input}
      />
      <ArrowDown className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={tokenABalance}
        token={tokenA}
        value={tokenAOutput}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={noop}
        noBalanceButtons
        disabled
        notSelectable
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={tokenBBalance}
        token={tokenB}
        value={tokenBOutput}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={noop}
        noBalanceButtons
        disabled
        notSelectable
      />
      <Button
        className={s.button}
        onClick={async () =>
          handleSubmitRemoveLiquidity({
            lpTokenInput,
            tokenAOutput,
            tokenBOutput,
            dex,
            tokenA,
            tokenB,
            // @ts-ignore I don't know type of it
            pairId
          })
        }
        disabled={!accountPkh}
      >
        Remove
      </Button>
    </>
  );
};
