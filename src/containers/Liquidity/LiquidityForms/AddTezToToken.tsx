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
  useAccountPkh,
} from '@utils/dapp';
import {
  WhitelistedToken,
} from '@utils/types';
import { fromDecimals } from '@utils/helpers';
import { TEZOS_TOKEN } from '@utils/defaults';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Plus } from '@components/svg/Plus';

import s from '../Liquidity.module.sass';
import {
  addLiquidity,
  calculateTokenAmount,
} from '../liquidutyHelpers';
import { initializeLiquidity } from '../liquidutyHelpers/initializeLiquidity';

type AddTezToTokenProps = {
  dex: FoundDex | null;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<WhitelistedToken>>;
  setTokenB: Dispatch<SetStateAction<WhitelistedToken>>;
  tokenABalance: string;
  tokenBBalance: string;
};

export const AddTezToToken:React.FC<AddTezToTokenProps> = ({
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

  const [tokenAInput, setTokenAInput] = useState<string>('');
  const [tokenBInput, setTokenBInput] = useState<string>('');

  const handleTokenAChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    if (event.target.value === '') {
      setTokenBInput('');
      return;
    }

    if (!dex
      || dex.storage.storage.tez_pool.eq(0)
      || dex.storage.storage.token_pool.eq(0)
    ) return;

    const isTokenATez = tokenA.contractAddress === TEZOS_TOKEN.contractAddress;
    let tokenAmount:BigNumber;
    if (isTokenATez) {
      tokenAmount = calculateTokenAmount(
        new BigNumber(event.target.value),
        dex.storage.storage.total_supply,
        dex.storage.storage.tez_pool,
        dex.storage.storage.token_pool,
      );
    } else {
      tokenAmount = calculateTokenAmount(
        new BigNumber(event.target.value),
        dex.storage.storage.total_supply,
        dex.storage.storage.token_pool,
        dex.storage.storage.tez_pool,
      );
    }

    setTokenBInput(
      fromDecimals(tokenAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
    );
  };

  const handleTokenBChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenBInput(event.target.value);

    if (event.target.value === '') {
      setTokenAInput('');
      return;
    }

    if (!dex
      || dex.storage.storage.tez_pool.eq(0)
      || dex.storage.storage.token_pool.eq(0)
    ) return;

    const isTokenBTez = tokenA.contractAddress === TEZOS_TOKEN.contractAddress;
    let tezAmount:BigNumber;
    if (isTokenBTez) {
      tezAmount = calculateTokenAmount(
        new BigNumber(event.target.value),
        dex.storage.storage.total_supply,
        dex.storage.storage.token_pool,
        dex.storage.storage.tez_pool,
      );
    } else {
      tezAmount = calculateTokenAmount(
        new BigNumber(event.target.value),
        dex.storage.storage.total_supply,
        dex.storage.storage.tez_pool,
        dex.storage.storage.token_pool,
      );
    }

    setTokenAInput(
      fromDecimals(tezAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
    );
  };

  const handleTokenABalance = (value:string) => {
    if (!dex) return;

    const fixedValue = new BigNumber(value);
    const tokenAmount = calculateTokenAmount(
      fixedValue,
      dex.storage.storage.total_supply,
      dex.storage.storage.tez_pool,
      dex.storage.storage.token_pool,
    );

    setTokenAInput(fixedValue.toFixed(tokenA.metadata.decimals));
    setTokenBInput(
      fromDecimals(tokenAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
    );
  };

  const handleTokenBBalance = (value:string) => {
    if (!dex) return;

    const fixedValue = new BigNumber(value);
    const tezAmount = calculateTokenAmount(
      fixedValue,
      dex.storage.storage.total_supply,
      dex.storage.storage.token_pool,
      dex.storage.storage.tez_pool,
    );

    setTokenBInput(fixedValue.toFixed(tokenB.metadata.decimals));
    setTokenAInput(
      fromDecimals(tezAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
    );
  };

  const handleAddLiquidity = async () => {
    if (!tezos || !accountPkh) return;

    const tezDecimals = new BigNumber(10).pow(TEZOS_TOKEN.metadata.decimals);
    const tezValue = new BigNumber(tokenAInput)
      .multipliedBy(tezDecimals);

    if (dex
      && dex.storage.storage.token_pool.gt(0)
      && dex.storage.storage.tez_pool.gt(0)
    ) {
      await addLiquidity(tezos, dex, tezValue);
    } else {
      const token:Token = {
        contract: tokenB.contractAddress,
        id: tokenB.fa2TokenId,
      };
      const tokenBDecimals = new BigNumber(10).pow(tokenB.metadata.decimals);
      const tokenBValue = new BigNumber(tokenBInput).multipliedBy(tokenBDecimals);
      await initializeLiquidity(tezos, token, tokenBValue, tezValue);
    }

    setTokenAInput('');
    setTokenBInput('');
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
        handleBalance={handleTokenABalance}
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
        handleBalance={handleTokenBBalance}
        noBalanceButtons={!accountPkh}
      />
      <div className={s.switcher}>
        <Switcher isActive={false} onChange={() => {}} />
        <span className={s.rebalance}>Rebalance Liq</span>
        <Tooltip content="Liquidity rebalace description" />
      </div>
      <Button
        className={s.button}
        onClick={handleAddLiquidity}
      >
        Add
      </Button>
    </>
  );
};
