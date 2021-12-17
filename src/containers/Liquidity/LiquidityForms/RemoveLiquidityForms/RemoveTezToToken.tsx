import React, { ChangeEvent, useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { ArrowDown, Button, Plus, Slippage } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { noop } from 'rxjs';

import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { TEZOS_TOKEN } from '@utils/defaults';
import { slippageToBignum } from '@utils/helpers';
import { Nullable, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import s from '../../Liquidity.module.sass';
import { removeLiquidity } from '../../liquidutyHelpers';

interface RemoveTezToTokenProps {
  dex: FoundDex | null;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  tokenABalance: string;
  tokenBBalance: string;
  lpTokenBalance: string;
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void;
}

export const RemoveTezToToken: React.FC<RemoveTezToTokenProps> = ({
  dex,
  tokenA,
  tokenB,
  tokenABalance,
  tokenBBalance,
  lpTokenBalance,
  onChangeTokensPair
}) => {
  const { t } = useTranslation(['common', 'liquidity']);
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [lpTokenInput, setLpTokenInput] = useState<string>('');
  const [tokenAOutput, setTokenAOutput] = useState<string>('');
  const [tokenBOutput, setTokenBOutput] = useState<string>('');
  const [slippage, setSlippage] = useState<BigNumber>(new BigNumber(0.005));

  useEffect(() => {
    if (!dex) {
      return;
    }
    if (!lpTokenInput) {
      setTokenAOutput('');
      setTokenBOutput('');

      return;
    }

    const tezPerOneLp = dex.storage.storage.tez_pool.dividedBy(dex.storage.storage.total_supply);

    const quipuPerOneLp = dex.storage.storage.token_pool.dividedBy(dex.storage.storage.total_supply);

    const isTokenATez = tokenA.contractAddress === TEZOS_TOKEN.contractAddress;

    if (isTokenATez) {
      setTokenAOutput(tezPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenA.metadata.decimals));
      setTokenBOutput(quipuPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenB.metadata.decimals));
    } else {
      setTokenAOutput(quipuPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenA.metadata.decimals));
      setTokenBOutput(tezPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenB.metadata.decimals));
    }
  }, [lpTokenInput, dex, tokenA, tokenB]);

  const handleSlippageChange = (value?: string) => {
    if (!value) {
      return;
    }
    const fixedValue = slippageToBignum(value);
    setSlippage(fixedValue.gte(100) ? new BigNumber(100) : fixedValue);
  };

  const handleRemoveLiquidity = async () => {
    if (!tezos || !accountPkh || !dex) {
      return;
    }

    await removeLiquidity(tezos, dex, new BigNumber(lpTokenInput), slippage);
    setLpTokenInput('');
  };

  const [tokenPair, setTokenPair] = useState<Nullable<WhitelistedTokenPair>>(null);

  useEffect(() => {
    if (dex) {
      setTokenPair({
        token1: tokenA,
        token2: tokenB,
        dex
      });
    }
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
        notSelectable
        disabled
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
