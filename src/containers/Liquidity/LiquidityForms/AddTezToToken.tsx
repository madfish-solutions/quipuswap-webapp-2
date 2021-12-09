import React, {
  useState,
  Dispatch,
  ChangeEvent,
  SetStateAction,
} from 'react';
import { Button } from '@quipuswap/ui-kit';
import { FoundDex, Token } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  useTezos,
  useAccountPkh,
  useNetwork,
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
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const networkId = useNetwork().id;

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

    let tezAmount:BigNumber;
    let tokenAmount:BigNumber;
    let tokenDecimals: number;
    const tezosDecimals = new BigNumber(10).pow(TEZOS_TOKEN.metadata.decimals);

    const isTokenATez = tokenA.contractAddress === TEZOS_TOKEN.contractAddress;
    if (isTokenATez) {
      tokenDecimals = tokenB.metadata.decimals;
      tezAmount = new BigNumber(event.target.value).multipliedBy(tezosDecimals);

      tokenAmount = calculateTokenAmount(
        tezAmount,
        dex.storage.storage.total_supply,
        dex.storage.storage.tez_pool,
        dex.storage.storage.token_pool,
      );
    } else {
      tokenDecimals = tokenA.metadata.decimals;
      tezAmount = new BigNumber(event.target.value).multipliedBy(tezosDecimals);

      tokenAmount = calculateTokenAmount(
        tezAmount,
        dex.storage.storage.total_supply,
        dex.storage.storage.token_pool,
        dex.storage.storage.tez_pool,
      );
    }

    setTokenBInput(
      fromDecimals(tokenAmount, tokenDecimals).toFixed(tokenDecimals),
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

    let tezAmount:BigNumber;
    let tokenDecimals:BigNumber;
    let tokenAmount:BigNumber;

    const isTokenBTez = tokenB.contractAddress === TEZOS_TOKEN.contractAddress;
    if (isTokenBTez) {
      tokenDecimals = new BigNumber(10).pow(tokenA.metadata.decimals);
      tokenAmount = new BigNumber(event.target.value).multipliedBy(tokenDecimals);

      tezAmount = calculateTokenAmount(
        tokenAmount,
        dex.storage.storage.total_supply,
        dex.storage.storage.token_pool,
        dex.storage.storage.tez_pool,
      );
    } else {
      tokenDecimals = new BigNumber(10).pow(tokenB.metadata.decimals);
      tokenAmount = new BigNumber(event.target.value).multipliedBy(tokenDecimals);

      tezAmount = calculateTokenAmount(
        tokenAmount,
        dex.storage.storage.total_supply,
        dex.storage.storage.tez_pool,
        dex.storage.storage.token_pool,
      );
    }

    setTokenAInput(
      fromDecimals(tezAmount, 6).toFixed(6),
    );
  };
  const handleTokenABalance = (value:string) => {
    const fixedValue = new BigNumber(value);

    setTokenAInput(fixedValue.toFixed(tokenA.metadata.decimals));

    if (!dex) return;

    const tokenAmount = calculateTokenAmount(
      fixedValue,
      dex.storage.storage.total_supply,
      dex.storage.storage.tez_pool,
      dex.storage.storage.token_pool,
    );

    setTokenBInput(
      fromDecimals(tokenAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
    );
  };

  const handleTokenBBalance = (value:string) => {
    const fixedValue = new BigNumber(value);

    setTokenBInput(fixedValue.toFixed(tokenB.metadata.decimals));

    if (!dex) return;

    const tezAmount = calculateTokenAmount(
      fixedValue,
      dex.storage.storage.total_supply,
      dex.storage.storage.token_pool,
      dex.storage.storage.tez_pool,
    );

    setTokenAInput(
      fromDecimals(tezAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
    );
  };
  const handleAddLiquidity = async () => {
    if (!tezos || !accountPkh) return;

    const notTezToken = tokenA.contractAddress !== TEZOS_TOKEN.contractAddress
      ? tokenA
      : tokenB;
    const notTezTokenInput = tokenA.contractAddress !== TEZOS_TOKEN.contractAddress
      ? tokenAInput
      : tokenBInput;
    const tezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress
      ? tokenAInput
      : tokenBInput;

    const tezDecimals = new BigNumber(10).pow(TEZOS_TOKEN.metadata.decimals);
    const tezValue = new BigNumber(tezTokenInput)
      .multipliedBy(tezDecimals);

    if (dex
      && dex.storage.storage.token_pool.gt(0)
      && dex.storage.storage.tez_pool.gt(0)
    ) {
      await addLiquidity(tezos, dex, tezValue);
    } else {
      const token:Token = {
        contract: notTezToken.contractAddress,
        id: notTezToken.fa2TokenId,
      };
      const tokenBDecimals = new BigNumber(10).pow(notTezToken.metadata.decimals);
      const tokenBValue = new BigNumber(notTezTokenInput).multipliedBy(tokenBDecimals);
      await initializeLiquidity(tezos, networkId, token, tokenBValue, tezValue);
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
      <Button
        className={s.button}
        onClick={handleAddLiquidity}
      >
        Add
      </Button>
    </>
  );
};
