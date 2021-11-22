import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Plus,
  Button,
  Slippage,
  ArrowDown,
} from '@quipuswap/ui-kit';
import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  useTezos,
  useNetwork,
  useAccountPkh,
  getUserBalance,
} from '@utils/dapp';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { QSMainNet, WhitelistedToken } from '@utils/types';
import { fromDecimals, noOpFunc } from '@utils/helpers';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';

import { removeLiquidity } from '../liquidutyHelpers';
import s from '../Liquidity.module.sass';

const QUIPU_TOKEN = { contract: 'KT1NfYbYTCRZsNPZ97VdLqSrwPdVupiqniFu', id: 0 };
const QUIPU_TEZ_LP = { contract: 'KT1MsQZeAbLuNfhfWdiUsJT4tTDzxymkaxwo', id: 0 };

type LiquidityFormRemoveProps = {
  dex: FoundDex;
};

export const LiquidityFormRemove: React.FC<LiquidityFormRemoveProps> = ({
  dex,
}) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const networkId = useNetwork().id as QSMainNet;

  const [lpTokenBalance, setLpTokenBalance] = useState('0');
  const [lpTokenInput, setLpTokenInput] = useState('');
  const [tokenAOutput, setTokenAOutput] = useState('777');
  const [tokenBOutput, setTokenBOutput] = useState('777');

  useEffect(() => {
    let isLoadBalances = true;
    const loadLpBalance = async () => {
      if (!tezos || !accountPkh) return;

      const userLpBalance = await getUserBalance(tezos, accountPkh, QUIPU_TEZ_LP.contract, 'fa2', QUIPU_TEZ_LP.id);

      if (userLpBalance && isLoadBalances) {
        setLpTokenBalance(fromDecimals(userLpBalance, 6).toFixed());
      }
    };
    loadLpBalance();

    return () => { isLoadBalances = false; };
  }, [dex, tezos, accountPkh]);

  useEffect(() => {
    if (lpTokenInput === '') {
      setTokenAOutput('');
      setTokenBOutput('');
      return;
    }

    const tezPerOneLp = dex.storage.storage.tez_pool
      .dividedBy(dex.storage.storage.total_supply);

    const quipuPerOneLp = dex.storage.storage.token_pool
      .dividedBy(dex.storage.storage.total_supply);

    setTokenAOutput(tezPerOneLp.multipliedBy(lpTokenInput).toFixed(6));
    setTokenBOutput(quipuPerOneLp.multipliedBy(lpTokenInput).toFixed(6));
  }, [lpTokenInput, dex]);

  return (
    <>
      <TokenSelect
        label="Select LP"
        balance={lpTokenBalance}
        token={TEZOS_TOKEN}
        setToken={(token) => token}
        value={lpTokenInput}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setLpTokenInput(event.target.value)}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={(value) => {
          const fixedValue = new BigNumber(value);
          setLpTokenInput(fixedValue.toFixed());
        }}
      />
      <ArrowDown className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance="888"
        token={TEZOS_TOKEN}
        setToken={(token) => token}
        value={tokenAOutput}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={noOpFunc}
        noBalanceButtons
        disabled
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance="888"
        token={STABLE_TOKEN}
        setToken={(token) => token}
        value={tokenBOutput}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={noOpFunc}
        noBalanceButtons
        disabled
      />
      <Slippage handleChange={noOpFunc} />
      <Button
        className={s.button}
        onClick={() => {
          if (!tezos || !accountPkh) return;
          removeLiquidity(
            tezos,
            networkId,
            QUIPU_TOKEN,
            new BigNumber(lpTokenInput),
            new BigNumber(0.1),
          );
          setLpTokenInput('');
        }}
      >
        Remove
      </Button>
    </>
  );
};
