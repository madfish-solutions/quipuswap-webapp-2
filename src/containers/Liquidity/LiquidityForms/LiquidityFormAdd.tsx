import React, {
  useState,
  Dispatch,
  ChangeEvent,
  SetStateAction,
} from 'react';
import {
  Button,
  Tooltip,
  Switcher,
} from '@quipuswap/ui-kit';
import { FoundDex, Token } from '@quipuswap/sdk';
// import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';

import {
  useTezos,
  useNetwork,
  useAccountPkh,
} from '@utils/dapp';
import {
  WhitelistedToken,
} from '@utils/types';
import { fromDecimals } from '@utils/helpers';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Plus } from '@components/svg/Plus';

import s from '../Liquidity.module.sass';
import {
  addLiquidity,
  calculateTokenAmount,
} from '../liquidutyHelpers';

type LiquidityFormProps = {
  dex: FoundDex;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<WhitelistedToken>>;
  setTokenB: Dispatch<SetStateAction<WhitelistedToken>>;
  tokenABalance: string;
  tokenBBalance: string;
};

type QSMainNet = 'mainnet' | 'florencenet' | 'granadanet';

export const LiquidityFormAdd:React.FC<LiquidityFormProps> = ({
  dex,
  tokenA,
  tokenB,
  setTokenA,
  setTokenB,
  tokenABalance,
  tokenBBalance,
}) => {
  // const { t } = useTranslation(['common', 'liquidity']);
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;

  const [tokenAInput, setTokenAInput] = useState<string>('');
  const [tokenBInput, setTokenBInput] = useState<string>('');

  const handleTokenAChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

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

    setTokenBInput(
      fromDecimals(tokenAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
    );
  };

  const handleTokenBChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setTokenBInput(event.target.value);

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

    setTokenAInput(
      fromDecimals(tezAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
    );
  };

  return (
    <>
      <TokenSelect
        label="Input"
        balance={tokenABalance}
        token={tokenA}
        setToken={setTokenA}
        value={tokenAInput}
        onChange={handleTokenAChange}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={(value) => {
          if (!dex) return;
          const fixedValue = new BigNumber(value);
          setTokenAInput(fixedValue.toFixed(tokenA.metadata.decimals));
          const tokenAmount = calculateTokenAmount(
            fixedValue,
            dex.storage.storage.total_supply,
            dex.storage.storage.tez_pool,
            dex.storage.storage.token_pool,
          );
          setTokenBInput(
            fromDecimals(tokenAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
          );
        }}
        noBalanceButtons={!accountPkh}
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Input"
        balance={tokenBBalance}
        token={tokenB}
        setToken={setTokenB}
        value={tokenBInput}
        onChange={handleTokenBChange}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={(value) => {
          if (!dex) return;
          const fixedValue = new BigNumber(value);
          setTokenBInput(fixedValue.toFixed(tokenB.metadata.decimals));
          const tezAmount = calculateTokenAmount(
            fixedValue,
            dex.storage.storage.total_supply,
            dex.storage.storage.token_pool,
            dex.storage.storage.tez_pool,
          );
          setTokenAInput(
            fromDecimals(tezAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
          );
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
          const token:Token = {
            contract: tokenB.contractAddress,
            id: tokenB.fa2TokenId,
          };

          addLiquidity(tezos, networkId, token, tezValue);
          setTokenAInput('');
          setTokenBInput('');
        }}
      >
        Add
      </Button>
    </>
  );
};
