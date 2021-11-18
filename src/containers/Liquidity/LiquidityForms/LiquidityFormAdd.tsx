import React, {
  useState,
  useEffect,
  ChangeEvent,
} from 'react';
import {
  Token,
  FoundDex,
} from '@quipuswap/sdk';
import {
  Button,
  Tooltip,
  Switcher,
} from '@quipuswap/ui-kit';
// import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';

import {
  useTezos,
  useNetwork,
  useAccountPkh,
  getUserBalance,
} from '@utils/dapp';
import {
  WhitelistedToken,
} from '@utils/types';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Plus } from '@components/svg/Plus';

import s from '../Liquidity.module.sass';
import {
  addLiquidity,
  calculateTokenAmount,
  calculateTezAmount,
} from '../liquidutyHelpers';

const QUIPU_TOKEN:Token = { contract: 'KT1NfYbYTCRZsNPZ97VdLqSrwPdVupiqniFu', id: 0 };

type LiquidityFormProps = {
  dex: FoundDex;
};

type QSMainNet = 'mainnet' | 'florencenet' | 'granadanet';

export const LiquidityFormAdd:React.FC<LiquidityFormProps> = ({ dex }) => {
  // const { t } = useTranslation(['common', 'liquidity']);
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;

  const [tokenABalance, setTokenABalance] = useState('0');
  const [tokenBBalance, setTokenBBalance] = useState('0');
  const [tokenAInput, setTokenAInput] = useState<string>('');
  const [tokenBInput, setTokenBInput] = useState<string>('');

  useEffect(() => {
    const getBothTokensBalances = async () => {
      if (!tezos || !accountPkh) return;

      const tokenA = await getUserBalance(tezos, accountPkh, TEZOS_TOKEN.contractAddress);
      const tokenB = await getUserBalance(tezos, accountPkh, 'KT1NfYbYTCRZsNPZ97VdLqSrwPdVupiqniFu', 'fa2');

      if (tokenA) setTokenABalance(tokenA.dividedBy(1_000_000).toFixed());
      if (tokenB) setTokenBBalance(tokenB.dividedBy(1_000_000).toFixed());
    };
    getBothTokensBalances();
  }, [tezos]);

  const handleTokenAChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    if (!tezos || !dex) return;
    if (event.target.value === '') {
      setTokenBInput('');
      return;
    }

    const tokenAmount = calculateTokenAmount(
      new BigNumber(event.target.value),
      dex.storage.storage.total_supply,
      dex.storage.storage.tez_pool,
      dex.storage.storage.token_pool,
    );

    setTokenBInput(tokenAmount.dividedBy(1_000_000).toFixed(6));
  };

  const handleTokenBChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setTokenBInput(event.target.value);

    if (!tezos || !dex) return;
    if (event.target.value === '') {
      setTokenAInput('');
      return;
    }

    const tezAmount = calculateTezAmount(
      new BigNumber(event.target.value),
      dex.storage.storage.total_supply,
      dex.storage.storage.token_pool,
      dex.storage.storage.tez_pool,
    );

    setTokenAInput(tezAmount.dividedBy(1_000_000).toFixed(6));
  };

  return (
    <>
      <TokenSelect
        label="Input"
        balance={tokenABalance}
        token={TEZOS_TOKEN}
        setToken={(token) => console.log(token)}
        value={tokenAInput}
        onChange={handleTokenAChange}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={(value) => {
          if (!dex) return;
          const fixedValue = parseFloat(value).toFixed(6);
          setTokenAInput(fixedValue);
          const tokenAmount = calculateTokenAmount(
            new BigNumber(fixedValue),
            dex.storage.storage.total_supply,
            dex.storage.storage.tez_pool,
            dex.storage.storage.token_pool,
          );
          setTokenBInput(tokenAmount.dividedBy(1_000_000).toFixed(6));
        }}
        noBalanceButtons={!accountPkh}
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Input"
        balance={tokenBBalance}
        token={STABLE_TOKEN}
        setToken={(token) => console.log(token)}
        value={tokenBInput}
        onChange={handleTokenBChange}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={(value) => {
          if (!dex) return;
          const fixedValue = parseFloat(value).toFixed(6);
          setTokenBInput(fixedValue);
          const tezAmount = calculateTezAmount(
            new BigNumber(fixedValue),
            dex.storage.storage.total_supply,
            dex.storage.storage.token_pool,
            dex.storage.storage.tez_pool,
          );
          setTokenAInput(tezAmount.dividedBy(1_000_000).toFixed(6));
        }}
        noBalanceButtons={!accountPkh}
      />
      <div className={s.switcher}>
        <Switcher isActive={false} onChange={() => {}} />
        <span className={s.rebalance}>Rebalance Liq</span>
        <Tooltip content="Liquidity rebalace description" />
      </div>
      <Button
        className={s.button}
        onClick={() => {
          if (!tezos || !accountPkh) return;

          const tezValue = new BigNumber(tokenAInput).multipliedBy(1_000_000);
          addLiquidity(tezos, networkId, QUIPU_TOKEN, tezValue);
          setTokenAInput('');
          setTokenBInput('');
        }}
      >
        Add
      </Button>
    </>
  );
};
