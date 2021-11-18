import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Plus,
  Button,
  Slippage,
  ArrowDown,
} from '@quipuswap/ui-kit';
import { FoundDex, Token } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  useTezos,
  useNetwork,
  useAccountPkh,
  getUserBalance,
} from '@utils/dapp';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { QSMainNet, WhitelistedToken } from '@utils/types';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';

import { removeLiquidity } from '../liquidutyHelpers';
import s from '../Liquidity.module.sass';

const QUIPU_TOKEN:Token = { contract: 'KT1NfYbYTCRZsNPZ97VdLqSrwPdVupiqniFu', id: 0 };

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

  useEffect(() => {
    const loadLpBalance = async () => {
      if (!tezos || !accountPkh) return;

      const userLpBalance = await getUserBalance(tezos, accountPkh, 'KT1MsQZeAbLuNfhfWdiUsJT4tTDzxymkaxwo', 'fa2');

      if (userLpBalance) setLpTokenBalance(userLpBalance.dividedBy(1_000_000).toFixed());
    };
    loadLpBalance();
  }, [dex]);

  return (
    <>
      <TokenSelect
        label="Select LP"
        balance={lpTokenBalance}
        token={TEZOS_TOKEN}
        setToken={(token) => console.log(token)}
        value={lpTokenInput}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setLpTokenInput(event.target.value)}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={(value) => {
          const fixedValue = parseFloat(value).toFixed(6);
          setLpTokenInput(fixedValue);
        }}
      />
      <ArrowDown className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance="888"
        token={STABLE_TOKEN}
        setToken={(token) => console.log(token)}
        onChange={() => {}}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={() => {}}
        noBalanceButtons
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance="888"
        token={STABLE_TOKEN}
        setToken={(token) => console.log(token)}
        onChange={() => {}}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={() => {}}
        noBalanceButtons
      />
      <Slippage handleChange={() => {}} />
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
