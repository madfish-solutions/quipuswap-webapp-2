import React, {
  useState,
  useEffect,
  ChangeEvent,
} from 'react';
import {
  Button,
  Tooltip,
  Switcher,
} from '@quipuswap/ui-kit';
import { FoundDex } from '@quipuswap/sdk';
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
} from '../liquidutyHelpers';

const QUIPU_TOKEN = { contract: 'KT1NfYbYTCRZsNPZ97VdLqSrwPdVupiqniFu', id: 0 };

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

      const tokenA = await getUserBalance(tezos, accountPkh, TEZOS_TOKEN.contractAddress, 'fa1.2');
      const tokenB = await getUserBalance(tezos, accountPkh, QUIPU_TOKEN.contract, 'fa2', QUIPU_TOKEN.id);

      if (tokenA) setTokenABalance(tokenA.dividedBy(1_000_000).toFixed());
      if (tokenB) setTokenBBalance(tokenB.dividedBy(1_000_000).toFixed());
    };
    getBothTokensBalances();
  }, [tezos, accountPkh]);

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

    const tezAmount = calculateTokenAmount(
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
        setToken={(token) => token}
        value={tokenAInput}
        onChange={handleTokenAChange}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={(value) => {
          if (!dex) return;
          const fixedValue = new BigNumber(value);
          setTokenAInput(fixedValue.toFixed());
          const tokenAmount = calculateTokenAmount(
            fixedValue,
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
        setToken={(token) => token}
        value={tokenBInput}
        onChange={handleTokenBChange}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={(value) => {
          if (!dex) return;
          const fixedValue = new BigNumber(value);
          setTokenBInput(fixedValue.toFixed());
          const tezAmount = calculateTokenAmount(
            fixedValue,
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
